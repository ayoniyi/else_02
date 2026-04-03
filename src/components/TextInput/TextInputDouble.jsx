import style from './TextInput.module.scss'
const TextInputDouble = (props) => {
  return (
    <div className={`${style.inputBox} + ${style.double} `}>
      <input
        className={style.field}
        type={props.type}
        name={props.inputName}
        value={props.value}
        onChange={props.inputHandler}
        autoComplete="off"
        required
        minLength="3"
        placeholder=" "
      />
      <label htmlFor="name" className={style.labelName}>
        <span className={style.contentName}>{props.labelName}</span>
      </label>
    </div>
  )
}

export default TextInputDouble
