import style from "./TextInput.module.scss";
const TextInput = (props) => {
  return (
    <div className={style.inputBox}>
      <input
        className={style.field}
        type={props.type}
        name={props.inputName}
        value={props.value}
        onChange={props.inputHandler}
        autoComplete="off"
        required
        minLength="2"
        maxLength="33"
        placeholder=" "
      />
      <label htmlFor="name" className={style.labelName}>
        <span className={style.contentName}>{props.labelName}</span>
      </label>
    </div>
    // className={
    //   props.errMsg === '' ? style.field : style.field + ' ' + style.fieldErr
    // }
  );
};

export default TextInput;
