import style from "./TextInput.module.scss";
const SelectInput = ({ children, labelName }) => {
  return (
    <div className={style.inputBox}>
      <select className={style.field2}>{children}</select>
      <label htmlFor="name" className={style.labelName}>
        <span className={style.contentName}>{labelName}</span>
      </label>
    </div>
    // className={
    //   props.errMsg === '' ? style.field : style.field + ' ' + style.fieldErr
    // }
  );
};

export default SelectInput;
