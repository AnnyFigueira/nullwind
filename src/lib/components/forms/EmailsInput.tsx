import Nullstack, { NullstackClientContext } from "nullstack";

import Input from "./Input";
import type { ComponentProps } from "../../types";
import Badge from "../Badge";
import XIcon from "../icons/XIcon";

interface EmailsInputProps extends ComponentProps {
  bind?: object;
  corner?: string;
  disabled?: boolean;
  error?: string;
  helper?: string;
  label?: string;
  onchange?: (emails: string[]) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}

const keycode = { comma: 44, enter: 13, backspace: 8 };
const triggerKeyCodes = [keycode.comma, keycode.enter];

class EmailsInput extends Nullstack {
  emails = [];
  inputRef: HTMLInputElement;

  prepare({ bind }: NullstackClientContext<EmailsInputProps>) {
    if (!bind) return;
    this.emails = bind.object[bind.property];
  }

  hydrate() {
    this.inputRef.addEventListener("keypress", this._onKeyPress);
    this.inputRef.addEventListener("keydown", this._onKeyDown);
    this.inputRef.addEventListener("paste", this._onPaste);
  }

  update({ bind, onchange }: NullstackClientContext<EmailsInputProps>) {
    if (!bind) return;
    bind.object[bind.property] = this.emails;
    onchange?.(this.emails);
  }

  terminate() {
    this.inputRef.removeEventListener("keypress", this._onKeyPress);
    this.inputRef.removeEventListener("keydown", this._onKeyDown);
    this.inputRef.removeEventListener("paste", this._onPaste);
  }

  _onKeyPress = (event: KeyboardEvent & { target: HTMLInputElement }) => {
    if (triggerKeyCodes.indexOf(event.keyCode) < 0) return;
    event.preventDefault();
    this._addEmail(event.target.value);
    event.target.value = "";
    event.target.focus();
  };

  _onKeyDown = (event: KeyboardEvent & { target: HTMLInputElement }) => {
    if (event.keyCode !== keycode.backspace || event.target.value) return;
    this._removeLastEmail();
  };

  _onPaste = (event: ClipboardEvent & { target: HTMLInputElement }) => {
    if (!event.target.matches("input")) return;
    event.preventDefault();
    const chunks = event.clipboardData.getData("Text").split(/(?:,| )+/);
    chunks.forEach((chunk) => this._addEmail(chunk));
    event.target.value = "";
  };

  _isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  _addEmail(email: string) {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !this._isValidEmail(trimmedEmail)) return;
    this.emails.push(trimmedEmail);
  }

  _removeEmail(email: string) {
    this.emails.splice(this.emails.indexOf(email), 1);
  }

  _removeLastEmail() {
    this.emails.pop();
  }

  render({
    class: klass,
    corner,
    customTheme,
    error,
    helper,
    id,
    label,
    placeholder = "Add email",
    required,
    useTheme,
    ...props
  }: NullstackClientContext<EmailsInputProps>) {
    const classes = useTheme(customTheme).emailsInput;

    return (
      <Input
        id={id}
        label={label}
        error={error}
        helper={helper}
        corner={corner}
        required={required}
        class={klass}
        customTheme={customTheme}
      >
        <div class={classes.root}>
          <div class={classes.badges.base}>
            {this.emails.map((email) => (
              <Badge customTheme={customTheme}>
                {email}
                <button class={classes.badges.close} onclick={() => this._removeEmail(email)}>
                  <XIcon class="w-4 h-4" />
                </button>
              </Badge>
            ))}
          </div>
          <input
            class={classes.base}
            type="text"
            placeholder={placeholder}
            ref={this.inputRef}
            required={required}
            {...props}
          />
        </div>
      </Input>
    );
  }
}

export default EmailsInput;
