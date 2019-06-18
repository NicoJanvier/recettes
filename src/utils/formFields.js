const formFields = {
  title: {
    label: "Titre",
    type: "text",
    defaultValue: "",
    mandatory: true
  },
  description: {
    label: "Description",
    type: "textarea",
    defaultValue: "",
    mandatory: false
  },
  url: {
    label: "Lien",
    type: "url",
    defaultValue: "",
    mandatory: false
  },
  vegetarian: {
    label: "Végétarien",
    type: "checkbox",
    defaultValue: false,
    mandatory: false
  }
};
export default formFields;
