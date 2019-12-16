import React, { Fragment } from "react";
import { Form, Icon, Input } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";

export interface IInputWrapper {
  form: WrappedFormUtils;
  id: string;
  type: string;
  iconType: string;
  placeholder?: string;
  inputError?: string;
  rules?: { required?: boolean; message?: string; validator?: any }[];
}

export function InputWrapper(props: IInputWrapper) {
  const { inputError } = props;
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched
  } = props.form;
  const { rules, id, type, placeholder, iconType } = props;

  const perfix = <Icon type={iconType} />;

  const userNameError = isFieldTouched(id) && getFieldError(id);
  const inputDecorate = getFieldDecorator(id, { rules })(
    <Input prefix={perfix} type={type} placeholder={placeholder || ""} />
  );

  return <Form.Item>{inputDecorate}</Form.Item>;
}
