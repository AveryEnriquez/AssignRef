import * as Yup from "yup";

const seasonBasicSchema = Yup.object().shape({
    name: Yup.string()
    .min(1)
    .required("Is Required"),
  year: Yup.number()
   .min(1)
  .required("Is Required"),
 
  weeks: Yup.number()
    .min(1)
    .max(52)
   .required("Is Required"),
   conferenceId: Yup.number().required("Is Required"),


})

export default seasonBasicSchema