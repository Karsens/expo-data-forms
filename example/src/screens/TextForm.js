import React from "react";
import { Alert, View, Text } from "react-native";
import { DataForm, Field } from "../wrappers/DataForms";
import Header from "../components/Header";

class Example extends React.Component {
  render() {
    const { data, mutate, navigation } = this.props;

    const fields: Field[] = [
      { field: "simpleImage", type: "simpleImage" },
      // { field: "image", type: "image", title: "Pick an image" },
      { field: "text", title: "Text" }, //default type is a text input
      { field: "textArea", title: "Text Area", type: "textArea" },
      { field: "numbers", title: "Fill in Numbers here", type: "numbers" },
      { field: "phone", title: "Phone number", type: "phone" },
      { field: "date", title: "Date", type: "date" },
      // {
      //   field: "STARTEND",
      //   titles: {
      //     start: "Start",
      //     end: "End"
      //   },
      //   mapFieldsToDB: ({ start, end }) => ({
      //     eventAt: start,
      //     eventEndAt: end
      //   }),
      //   startSection: true,
      //   type: "dates"
      // },

      {
        startSection: true,
        field: "color",
        title: "Color",
        type: "color"
      },

      { field: "boolean", title: "Boolean type", type: "boolean" },

      {
        startSection: true,
        field: "LOCATION",
        mapFieldsToDB: same => same, //but different
        title: "Location",
        type: "location"
      },

      {
        field: "selectOne",
        title: "Select one option",
        type: "selectOne",
        values: [
          { value: 1, label: "option 1" },
          { value: 2, label: "option 2" },
          { value: 3, label: "option 3" }
        ]
      },

      {
        field: "selectMultiple",
        title: "Select multiple options",
        type: "selectMultiple",
        values: ["option 1 ", "option 2 ", "option 3"]
      },

      {
        field: "categories",
        title: "Fill in some categories",
        type: "categories"
      },

      { field: "dictionary", title: "Dictionary", type: "dictionary" },
      { field: "birthday", title: "Birthday", type: "birthday" }
    ];

    return (
      <View style={{ flex: 1 }}>
        <Header navigation={navigation} />

        <DataForm
          navigation={navigation}
          fields={fields}
          onComplete={() => Alert.alert("Saved")}
          //here you can put a graphql or redux mutation
          mutate={vars =>
            new Promise((resolve, reject) => {
              console.log("vars", vars);
              resolve({ data: "some data from mutation" });
            })
          }
          values={{
            // this can come from a graphql query
            simpleImage: "",
            text: "",
            textArea: "",
            numbers: "",
            phone: "",
            color: "",
            boolean: false,

            selectOne: "",
            selectMultiple: "",
            categories: "",
            dictionary: "",
            eventAt: "",
            birthday: {}
          }}
        />
      </View>
    );
  }
}

export default Example;
