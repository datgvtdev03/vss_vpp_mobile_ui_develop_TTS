import withLabel from "../../../common/hoc/withLabel";
import BaseRadioButton from "./RadioButton";
import RadioButtonGroup from "./RadioButtonGroup";
import RadioButtonItem from "./RadioButtonItem";

export default BaseRadioButton;

export const RadioGroupWithLabel = withLabel(RadioButtonGroup);

export { RadioButtonGroup, RadioButtonItem };
