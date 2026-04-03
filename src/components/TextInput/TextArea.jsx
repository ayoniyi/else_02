import style from "./TextInput.module.scss";
const TextArea = (props) => {
  return (
    <div className={style.inputBox}>
      <textarea
        className={style.field3}
        type={props.type}
        name={props.inputName}
        value={props.value}
        onChange={props.inputHandler}
        autoComplete="off"
        required
        minLength="2"
        // maxLength="33"
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

export default TextArea;
