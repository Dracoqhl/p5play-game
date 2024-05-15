function addAxios() {
  let scriptTag = document.createElement("script");
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.src = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
  document.head.appendChild(scriptTag);
}

addAxios();

class P5LLM {
  messages = [];
  maxMessage = 6;
  systemPrompt = "";
  onComplete = null;
  onStream = null;
  onError = null;

  clearAllMessage() {
    this.messages = [];
  }

  setMaxMessage(max) {
    try {
      max = parseInt(max);
    } catch (error) {
      return;
    }
    this.maxMessage = max;
  }

  setSystemPrompt(systemPrompt) {
    this.systemPrompt = systemPrompt;
  }

  // 发送前包装
  preSend() {
    // trim to max message
    if (this.maxMessage > 0) {
      if (this.messages.length > this.maxMessage) {
        this.messages.splice(1, this.messages.length - this.maxMessage);
      }
    }

    let exactMessages = [
      {
        role: "system",
        content: this.systemPrompt,
      },
      ...this.messages,
    ];

    return exactMessages;
  }

  promptCheck(userPrompt) {
    if (typeof userPrompt === "string") {
      this.messages.push({
        role: "user",
        content: userPrompt,
      });
    } else {
      this.messages = [...this.messages, ...userPrompt];
    }
  }

  send(userPrompt, stream) {
    if (stream) {
      this.stream(userPrompt);
    } else {
      this.dialog(userPrompt);
    }
  }

  dialog(userPrompt) {
    this.promptCheck(userPrompt);
  }

  stream(userPrompt) {
    // 请根据不同模型重写
    this.promptCheck(userPrompt);
  }
}

class P5Spark extends P5LLM {
  appID = "f623e299";

  Spark() {}
  setModel(model) {}

  generateRandomAPPID() {
    const min = 10000;
    const max = 99999;
    const randomFourDigitNumber =
      Math.floor(Math.random() * (max - min + 1)) + min;
    return randomFourDigitNumber.toString();
  }

  async send(userPrompt, stream) {
    let spark = this; // 匿名函数里会丢失this
    super.dialog(userPrompt);

    let sendMessages = this.preSend();

    let toSend = {
      header: {
        app_id: this.appID,
        uid: this.generateRandomAPPID(),
      },
      parameter: {
        chat: {
          domain: "generalv3.5",
          temperature: 0.5,
          max_tokens: 8192,
        },
      },
      payload: {
        message: {
          text: sendMessages,
        },
      },
    };

    try {
      let res = await axios.get("http://175.178.55.161:9210/getSparkURL");
      const socket = new WebSocket(res.data);
      socket.storage = [];
      socket.onopen = function (event) {
        console.log("WebSocket连接已打开");
        socket.send(JSON.stringify(toSend));
      };
      socket.onmessage = function (event) {
        let jsonMessage = JSON.parse(event.data);
        console.log(jsonMessage);
        let content = jsonMessage.payload.choices.text[0].content;
        socket.storage.push(content);
        if (spark.onStream) {
          spark.onStream(content);
        }
      };
      socket.onclose = function (event) {
        const jointedString = socket.storage.join("");
        console.log(jointedString);
        spark.messages.push({
          role: "assistant",
          content: jointedString,
        });
        console.log("WebSocket连接已关闭", event.code, event.reason);
        console.log(spark.messages);
        if (spark.onComplete) {
          spark.onComplete(jointedString);
        }
      };
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }
}

class P5GPT extends P5LLM {
  model = "gpt-3.5-turbo";
  P5GPT() {}

  setModel(model) {
    if (model === 4) {
      this.model = "gpt-4";
    } else {
      this.model = "gpt-3.5-turbo";
    }
  }

  async dialog(userPrompt) {
    super.dialog(userPrompt);
    let sendMessages = this.preSend();
    let content;
    try {
      let res = await axios({
        method: "post",
        url: "http://175.178.55.161:9210/dialogGPT",
        data: {
          model: this.model,
          messages: sendMessages,
        },
      });

      console.log(res);
      content = res.data.choices[0].message.content;
      this.messages.push({
        role: "assistant",
        content: content,
      });

      if (this.onComplete) {
        this.onComplete(content);
      }

      return content;
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  stream(userPrompt) {
    super.stream(userPrompt);
    let sendMessages = this.preSend();
    let agent = this;

    const socket = new WebSocket("ws://175.178.55.161:9210/streamGPT");

    let toSend = {
      model: this.model,
      messages: sendMessages,
    };

    try {
      socket.onopen = function (event) {
        console.log("WebSocket连接已打开");
        socket.send(JSON.stringify(toSend));
      };
      socket.onmessage = function (event) {
        console.log(event.data);
        if (agent.onStream) {
          agent.onStream(event.data);
        }
      };
      socket.onclose = function (event) {
        agent.onComplete();
        console.log("WebSocket连接已关闭", event.code, event.reason);
      };
    } catch (error) {
      console.error(error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }
}
