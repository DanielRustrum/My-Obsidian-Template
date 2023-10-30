/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  DVOModal: () => DVOModal,
  default: () => DVO
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// template.ts
function signal(default_value = void 0) {
  let signal_obj = {
    render_type: "signal",
    subscribed: [],
    _value: default_value
  };
  Object.defineProperty(signal_obj, "value", {
    get() {
      return this._value;
    },
    set(new_value) {
      this._value = new_value;
      this.subscribed.forEach((callback) => callback(new_value));
    }
  });
  return signal_obj;
}
function bind(signal2, callback) {
  signal2.subscribed.push(callback);
}
function collapseTemplate(strings, values) {
  let current_string = "", new_result = [];
  for (let index = 0; index < values.length; index += 1) {
    current_string += strings[index];
    if (values[index].render_type === "signal" || Array.isArray(values[index]) && values[index][0].render_type === "signal" || values[index].render_type === "template" || Array.isArray(values[index]) && values[index][0].render_type === "template" || values[index].render_type === "child" || typeof values[index] === "function") {
      new_result.push(current_string);
      current_string = "";
      new_result.push(values[index]);
    } else {
      current_string += values[index];
    }
  }
  new_result.push(current_string + strings[strings.length - 1]);
  return new_result;
}
function buildVDOM(template2) {
  let root = {
    render_type: "template",
    children: []
  };
  let current_node = root;
  let stack = [], attribute = [], attributes = [], content = [];
  let last_char = "", element = "", partial_attribute = "", partial_content = "";
  let in_tag = false, in_close_tag = false, in_content = false, in_attributes = false, in_attribute_string = false;
  stack.push(root);
  for (let segment of template2) {
    if (typeof segment === "string") {
      for (let char of segment) {
        if (in_tag && ["=", " ", ">"].includes(char) && !in_attribute_string && in_attributes && !in_close_tag) {
          if (partial_attribute !== "")
            attribute.push(partial_attribute);
          partial_attribute = "";
        }
        if (in_tag && (char === " " || char === ">") && !in_attribute_string && in_attributes && !in_close_tag) {
          if (attribute.length !== 0)
            attributes.push(attribute);
          attribute = [];
        }
        if (in_tag && !in_attributes && !["/", " ", ">"].includes(char) && !in_close_tag)
          element += char;
        if (in_tag && in_attributes && (!in_attribute_string && !["/", " ", ">", "=", '"', "'", "\n"].includes(char) || in_attribute_string && !['"'].includes(char)) && !in_close_tag)
          partial_attribute += char;
        if (in_content && char !== "<")
          partial_content += char;
        if (char === "<") {
          in_content = false;
          if (partial_content !== "")
            content.push(partial_content);
          if (content.length !== 0 && current_node)
            current_node.children.push(content);
          content = [];
          partial_content = "";
        }
        if (char === ">") {
          if (in_tag) {
            let node = {
              render_type: "node",
              children: []
            };
            if (!in_close_tag) {
              node["element"] = element;
              node["attrs"] = attributes;
              current_node.children.push(node);
              if (last_char !== "/") {
                stack.push(current_node);
                current_node = node;
              }
            } else {
              current_node = stack.pop();
            }
            in_tag = false;
            in_close_tag = false;
            in_attributes = false;
            attributes = [];
            element = "";
          }
          in_content = true;
        }
        if (in_tag && char === " ")
          in_attributes = true;
        if (char === "<")
          in_tag = true;
        if (last_char === "<" && char === "/")
          in_close_tag = true;
        if (char === '"' && in_attributes)
          in_attribute_string = !in_attribute_string;
        last_char = char;
      }
    }
    if (segment.render_type === "signal") {
      if (in_content) {
        content.push(partial_content);
        content.push(segment);
        partial_content = "";
      }
      if (in_attributes) {
        attribute.push(segment);
      }
    }
    if (typeof segment === "function") {
      if (in_attributes && attribute.length === 1) {
        attribute.push(segment);
      }
    }
    if (segment.render_type === "template" || segment.render_type === "child") {
      current_node.children.push(segment);
    }
    if (Array.isArray(segment)) {
      if (segment[0].render_type === "signal") {
        if (in_content) {
          content.push(partial_content);
          content.push(segment);
          partial_content = "";
        }
        if (in_attributes) {
          attribute.push(segment);
        }
      }
      if (segment[0].render_type === "template") {
        current_node.children.push(...segment);
      }
    }
  }
  return root;
}
function buildFragment(VDOM) {
  if (VDOM.render_type === "template") {
    let node_fragment = new DocumentFragment();
    for (let node of VDOM.children) {
      let [result_node, _] = buildFragment(node);
      node_fragment.append(result_node);
    }
    return [node_fragment, {}];
  }
  if (VDOM.render_type === "node") {
    let element = document.createElement(VDOM["element"]);
    for (let attr of VDOM.attrs) {
      if (attr[0].startsWith("[") && attr[0].endsWith("]"))
        element.addEventListener(
          attr[0].substr(
            1,
            attr[0].length - 2
          ),
          attr[1]
        );
      else if (attr.length === 1)
        element.setAttribute(attr[0], "");
      else if (attr[1].render_type === "signal") {
        element.setAttribute(attr[0], attr[1].value);
        bind(attr[1], (value) => {
          element.setAttribute(attr[0], value);
        });
      } else if (Array.isArray(attr[1]) && attr[1][0].render_type === "signal") {
        if (attr[1][1].constructor.name == "AsyncFunction")
          element.setAttribute(
            attr[0],
            attr[1][1]().then(() => {
            }).catch((error) => {
              throw error;
            })
          );
        else
          element.setAttribute(
            attr[0],
            attr[1][1]()
          );
        bind(attr[1][0], () => {
          if (attr[1][1].constructor.name == "AsyncFunction")
            element.setAttribute(
              attr[0],
              attr[1][1]().then(() => {
              }).catch((error) => {
                throw error;
              })
            );
          else
            element.setAttribute(
              attr[0],
              attr[1][1]()
            );
        });
      } else
        element.setAttribute(attr[0], attr[1]);
    }
    let index = 0;
    let signals = [];
    for (let node of VDOM.children) {
      let [result_node, data] = buildFragment(node);
      if ("signals" in data && data.signals.length > 0) {
        signals.push([index, data.signals, node]);
      }
      if (typeof result_node === "string")
        element.insertAdjacentHTML("beforeend", result_node);
      else
        element.append(result_node);
      index += 1;
    }
    if (signals.length > 0) {
      for (let signal_data of signals) {
        for (let signal2 of signal_data[1]) {
          bind(signal2, () => {
            let [result_node, _] = buildFragment(signal_data[2]);
            let old = element.childNodes[signal_data[0]];
            old.replaceWith(
              result_node
            );
          });
        }
      }
    }
    return [element, {}];
  }
  if (VDOM.render_type === "child") {
    return [VDOM.content, {}];
  }
  let content_string = "";
  let signals_content = [];
  for (let content of VDOM) {
    if (content.render_type === "signal") {
      content_string += content.value;
      signals_content.push(content);
    } else if (Array.isArray(content) && content[0].render_type === "signal") {
      if (content[1].constructor.name == "AsyncFunction")
        content_string += content[1]().then(() => {
        }).catch((error) => {
          throw error;
        });
      else
        content_string += content[1]();
      signals_content.push(content[0]);
    } else {
      content_string += content;
    }
  }
  return [document.createTextNode(content_string), {
    signals: signals_content
  }];
}
function template(strings, ...values) {
  return buildVDOM(collapseTemplate(strings, values));
}
function render(template2) {
  return buildFragment(template2)[0];
}

// main.ts
var DEFAULT_SETTINGS = {
  mySetting: "default"
};
var modal_map = /* @__PURE__ */ new Map();
var collections = /* @__PURE__ */ new Map();
var bin_path;
var DVOModal = class extends import_obsidian.Modal {
  constructor(app) {
    super(app);
    this.id = "";
  }
  onOpen() {
    let { contentEl } = this;
    let content = modal_map.get(this.id);
    contentEl.append(content === void 0 ? "" : content);
  }
  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
  setID(id) {
    this.id = id;
    return this;
  }
};
var DVO = class extends import_obsidian.Plugin {
  //@ts-ignore
  async onload() {
    await this.loadSettings();
    let plugin = this;
    bin_path = `/Meta/Database`;
    globalThis.DvO = {
      command: (name, callback) => {
        let id = name.toLowerCase().replace(" ", "-");
        plugin.addCommand({
          id,
          name,
          callback
        });
      },
      modal: {
        define: (id, content) => {
          modal_map.set(id, content);
        },
        //@ts-ignore
        open: (id) => {
          new DVOModal(this.app).setID(id).open();
        }
      },
      vault: {
        //@ts-ignore
        create: async (path, content = "") => {
          if (path[path.length - 1] === "/" || path[path.length - 1] === "\\")
            this.app.vault.createFolder(`./${path}`);
          else
            this.app.vault.create(
              `./${path}.md`,
              content === "" ? "" : content
            );
        },
        read: async (file) => {
          let vault_file;
          if (file === "") {
            vault_file = plugin.app.vault.fileMap[""];
          } else {
            vault_file = plugin.app.vault.fileMap[file];
          }
          return await plugin.app.vault.read(vault_file);
        },
        write: async (file, content) => {
          let vault_file;
          if (file === "") {
            vault_file = plugin.app.vault.fileMap[""];
          } else {
            vault_file = plugin.app.vault.fileMap[file];
          }
          return await plugin.app.vault.modify(vault_file, content);
        },
        //@ts-ignore
        append: async (file, content) => {
          let vault_file;
          if (file === "") {
            vault_file = plugin.app.vault.fileMap[""];
          } else {
            vault_file = plugin.app.vault.fileMap[file];
          }
          return await plugin.app.vault.append(vault_file, content);
        },
        delete: async (file) => {
          let vault_file;
          if (file === "") {
            vault_file = plugin.app.vault.fileMap[""];
          } else {
            vault_file = plugin.app.vault.fileMap[file];
          }
          return await plugin.app.vault.delete(vault_file, true);
        },
        metadata: async (file) => {
          let vault_file;
          if (file === "") {
            vault_file = plugin.app.vault.fileMap[""];
          } else {
            vault_file = plugin.app.vault.fileMap[file];
          }
        }
      },
      storage: {
        set: (collection, data) => {
          if (Array.isArray(data))
            collections.set(collection, [
              ...collections.get(collection),
              ...data
            ]);
          else if (typeof data === "object")
            collections.set(collection, {
              ...collections.get(collection),
              ...data
            });
          else
            collections.set(collection, data);
        },
        get: async (collection) => {
          let data = collections.get(collection);
          if (data === void 0) {
            let vault_file = plugin.app.vault.fileMap[`${bin_path}/${collection}.bucket`];
            data = JSON.parse(
              //@ts-ignore
              await plugin.app.vault.read(vault_file)
            );
          }
          return data;
        },
        save: async () => {
          for (let [collection, data] of collections) {
            let vault_file = plugin.app.vault.fileMap[`${bin_path}/${collection}.bucket`];
            try {
              await plugin.app.vault.create(
                vault_file,
                JSON.stringify(data)
              );
            } catch (error) {
              console.log(error);
              await plugin.app.vault.modify(
                vault_file,
                JSON.stringify(data)
              );
            }
          }
        },
        delete: async (collection) => {
          let vault_file = plugin.app.vault.fileMap[`${bin_path}/${collection}.bucket`];
          await plugin.app.vault.delete(vault_file, true);
        }
      },
      dom: {
        script: (src) => {
        },
        css: (styles) => {
        }
      },
      jobs: {},
      settings: {},
      templates: {
        define: template,
        signal,
        render,
        bind
      }
    };
    this.addSettingTab(new DVOSettingTab(this.app, this));
  }
  onunload() {
    const fs = require("fs");
    for (let [collection, data] of collections) {
      fs.writeFileSync(
        `${bin_path}/${collection}.bucket`,
        JSON.stringify(data)
      );
    }
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var DVOSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Setting #1").setDesc("It's a secret").addText((text) => text.setPlaceholder("Enter your secret").setValue(this.plugin.settings.mySetting).onChange(async (value) => {
      this.plugin.settings.mySetting = value;
      await this.plugin.saveSettings();
    }));
  }
};
