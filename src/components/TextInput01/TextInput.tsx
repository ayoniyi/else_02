import style from './TextInput.module.scss'
const TextField = (props: {
  labelName?: string
  inputName?: string
  type?: string
  value?: string
  //fieldClasses?: any
  errMsg?: string
  inputHandler?: any
  passwordConfirmref?: any
}) => {
  return (
    <div className={style.inputBox}>
      <input
        className={style.field}
        type={props.type}
        name={props.inputName}
        value={props.value}
        ref={props.passwordConfirmref}
        onChange={props.inputHandler}
        autoComplete="off"
        required
        //minLength="3"
      />
      <label htmlFor="name" className={style.labelName}>
        <span className={style.contentName}>{props.labelName}</span>
      </label>
    </div>
    // className={
    //   props.errMsg === '' ? style.field : style.field + ' ' + style.fieldErr
    // }
  )
}

export default TextField
