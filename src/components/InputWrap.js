import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import './InputWrap.scss';

const InputWrap = props => {
  const { inputText, inputChange, searchBtnClick, keyDown } = props;

  const deleteInputText = e => {
    inputChange(e);
  };

  return (
    <div className="inputWrap">
      <FontAwesomeIcon className="iconSearch" icon={faMagnifyingGlass} />
      <input
        type="text"
        className="inputBox"
        placeholder="질환명을 입력해주세요"
        onChange={inputChange}
        onKeyDown={keyDown}
        value={inputText}
      />

      <button
        className={inputText ? 'deleteBtn' : 'deleteBtn hidden'}
        onClick={deleteInputText}
      >
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
      <button type="button" className="searchBtn" onClick={searchBtnClick}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
};

export default InputWrap;
