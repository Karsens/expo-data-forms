import React from "react";

import { ActivityIndicator, View, Keyboard } from "react-native";

import {
  notNullNorUndefined,
  mergeObjectArray,
  removeDuplicates
} from "./utils";
import Button from "./button.component";
import { Component as KAS } from "./KAS";

/**
 * #toSearch
 * How to type a react-component input? Somehow TypeScript and JS have different Types available, it seems. Find one that works for both.
 *
 */
export type Field = {
  /**
   * REQUIRED. key of the field (should be the same as the key used in the values-prop of DataForm
   */
  field: string,

  /**
   * title of the field
   */
  title?: string,

  /**
   * some types require multiple titles
   */
  titles?: Object,

  /**
   * type of the field, if not set, it uses a TextField
   */
  type?: string,

  /**
   * possible values of the field if it's a input type where you can choose between values
   */
  values?: string[] | Value[],

  /**
   * optional info for the component which is exposed via a clickable info icon
   */
  info?: string,

  /**
   * option description text
   */
  description?: string,

  /**
   * optional description component
   */
  descriptionComponent?: React.ElementType,

  /**
   * section title, if new section above this field. true if titleless section starts here
   */
  startSection?: string | boolean,

  /**
   * optionally, if its a new section, add an description
   */
  startSectionDescription?: string,

  /**
   * validate input and return if it's valid or not
   */
  validate?: (value: any) => boolean,

  /**
   * do something when the value changes
   */
  onChange?: (value: any) => void,

  /**
   * if it's invalid, show this error message
   */
  errorMessage?: string,

  /**
   * function that transforms any (nested) object into a flat object suited for the database
   */
  mapFieldsToDB?: (state: any) => Object,

  /**
   * hide the input field based on all current values
   */
  hidden?: (allCurrentValues: Object) => boolean,

  /**
   * add extra props to the specific field you want to pass to the input. you could also pass props just as properties of the main object, but this is the neater way.
   */
  passProps?: Object
};

export type Props = {
  /**
   * The fields in your data-form
   */
  fields: Field[],

  /**
   * Values object. keys should be the same as field.field prop.
   */
  values: Object,

  /**
   * Title of complete button
   */
  completeButton?: string,

  /**
   * Get the onComplete function to put it somewhere else, for example, in the navbar.
   */
  withComplete?: () => void,

  /**
   * Get the reset function to put it somewhere, for example, in the navbar.
   */
  withReset?: () => void,

  /**
   * background color code of complete button row
   */
  completeButtonBackground?: string,

  /**
   * Object where keys are inputtype names, and values are React.Node that's the Input component
   */
  inputTypes: Object,

  /**
   * FieldComponent: builds the field around the inputtype, for example adding a title, description, info, and a new section.
   */
  FieldComponent: React.ElementType,

  /**
   * If true, the form doesn't use a scrollview with flex of 1
   */
  noScroll?: boolean,

  /**
   * if true, all values are submitted on completion. Also unchanged ones
   */
  submitAll?: boolean,

  /**
   * mutation function. should return a promise with result data
   */
  mutate: (vars: Object) => Promise<any>,

  /**
   * if noNavigationBelow, KAV will notice and will avoid some more
   */
  noNavigationBelow?: boolean,

  /**
   * what to do after mutate promise resolves
   */
  onComplete?: (data: Object, values: Object) => void,

  /**
   * if true, form sets values to undefined once completed
   */
  clearOnComplete?: boolean
};

export type Value = {
  label: string,
  value: string | number
};

export type State = {
  loading: boolean
};

export class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.saveValues = this.saveValues.bind(this); //to give props
    this.state = { loading: false };
  }

  renderInput = ({ field, value, key }) => {
    const { inputTypes, FieldComponent } = this.props;

    const isHidden = !!(
      field.hidden && field.hidden(this.getAllCurrentValues())
    );

    const inputProps = {
      state: this.state,
      setFormState: newState => this.setState(newState),
      value,
      ...field
    };

    const InputClass = field.type
      ? inputTypes[field.type]
      : inputTypes[Object.keys(inputTypes)[0]];

    if (InputClass && !isHidden) {
      const inputField = <InputClass {...inputProps} />;
      return FieldComponent({
        inputField,
        inputProps: { ...field },
        state: this.state,
        key
      });
    }

    return null;
  };

  clearState = () => {
    const { fields } = this.props;
    const allFields = fields.reduce(
      (result, f) => ({ ...result, [f.field]: undefined }),
      {}
    );

    this.setState(allFields);
  };

  getAllCurrentValues() {
    const { fields, values } = this.props;

    const valueKeysFromFields = fields.map(field => field.field);
    const valueKeysFromValues = Object.keys(values);
    const reallyAllValueKeys = removeDuplicates(
      valueKeysFromFields.concat(valueKeysFromValues)
    );

    return (
      values &&
      mergeObjectArray(
        reallyAllValueKeys.map(valueKey => {
          return {
            [valueKey]: notNullNorUndefined(this.state[valueKey])
              ? this.state[valueKey]
              : values[valueKey]
          };
        })
      )
    );
  }

  validateValues = () => {
    const { fields, submitAll } = this.props;

    let values = submitAll ? this.getAllCurrentValues() : {};

    let error = false;

    fields.forEach(({ field, mapFieldsToDB, validate, errorMessage }) => {
      if (notNullNorUndefined(this.state[field])) {
        //theres something inside, can also be a value that still has to be mapped to db values.

        if (mapFieldsToDB) {
          values[field] = undefined;
          //if mapFieldsToDB is used, the field value itself is unimportant and probably unused
          values = Object.assign(values, mapFieldsToDB(this.state[field]));
        } else {
          values[field] = this.state[field];
        }
      }

      if (validate && validate(this.state[field]) !== true) {
        error = true;
        this.setState({ [field + "Error"]: errorMessage });
      }
    });

    return { values, error };
  };

  saveValues = () => {
    const { onComplete } = this.props;

    this.setState({ loading: true }, () => {
      Keyboard.dismiss();
      // NB: Before going to a new screen (on onComplete) keyboard should always be closed (assumption)

      const { values, error } = this.validateValues();

      if (error) {
        this.setState({ loading: false });
      } else {
        console.log("No error with values:", Object.keys(values));

        this.props
          .mutate(values)
          .then(({ data }) => {
            //for api, state, dispatch support etc, the result should be taken based on mutationtype or so.

            this.setState({ loading: false }, () => {
              onComplete && onComplete(data, values);
              if (this.props.clearOnComplete) {
                this.clearState();
              }
            });
          })
          .catch(e => console.log("ERROR", e));
      }
    });
  };

  renderSaveButton() {
    const { completeButtonBackground } = this.props;

    const completeButton = this.props.completeButton
      ? this.props.completeButton
      : "Save";

    return (
      <View
        style={{
          height: 50,
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: 20,
          backgroundColor: completeButtonBackground
            ? completeButtonBackground
            : "#ecf0f1"
        }}
      >
        {this.state.loading ? (
          <View style={{ marginLeft: 50 }}>
            <ActivityIndicator />
          </View>
        ) : (
          <Button title={completeButton} onPress={() => this.saveValues()} />
        )}
      </View>
    );
  }

  render() {
    const { fields, values, noScroll, noNavigationBelow } = this.props;

    const allFields = fields.map((field, index) => {
      return this.renderInput({
        field,
        value: values[field.field],

        /*
        is buggy with images
        
        field.mapFieldsToDB
          ? field.mapFieldsToDB(values)
          : 
          */
        key: `field-${index}`
      });
    });

    return noScroll ? (
      <View>
        {allFields}
        {this.renderSaveButton()}
      </View>
    ) : (
      <KAS
        noNavigationBelow={noNavigationBelow}
        footer={this.renderSaveButton()}
      >
        {allFields}
      </KAS>
    );
  }
}
