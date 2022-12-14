import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Search.scss';
import { debounce } from 'lodash';

const Search = () => {
  const [data, setData] = useState();
  const [inputText, setInputText] = useState();
  const [toggle, setToggle] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const getdata = params => {
    axios
      .get(`https://json-server-beryl.vercel.app/api/sick?q=${params}`)

      .then(respon => {
        console.log(respon);
        bold(respon, params);
        console.info('calling api');
      })
      .catch(() => {
        console.log('fail');
      });
  };

  const bold = (respon, params) => {
    let newData = [];
    let responData = respon.data;

    responData.forEach(function (item) {
      let regex = new RegExp(params, 'gi');
      let result = item.sickNm.replace(
        regex,
        '<strong>' + params + '</strong>'
      );
      newData.push({
        sickNm: result,
      });
    });
    setData(newData);
  };
  const change = debounce(e => {
    setInputText(e.target.value);

    if (e.target.value.length > 0) {
      let blank_pattern = /^\s+|\s+$/g;
      if (e.target.value.replace(blank_pattern, '') === '') {
        return false;
      }
      if (e.keyCode !== 40 && e.keyCode !== 38) {
        getdata(e.target.value);
      }
    } else {
      setData(null);
    }
  }, 900);

  const click = e => {
    if (e.target.className === 'inputBox') {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const keyDown = e => {
    if (e.keyCode === 40) {
      setTabIndex(tabIndex + 1);
      if (tabIndex === 5) {
        setTabIndex(0);
      }
    } else if (e.keyCode === 38) {
      setTabIndex(tabIndex - 1);
      if (tabIndex === 0) {
        setTabIndex(5);
      }
    }
  };

  const recentClick = e => {
    let str = e.target.innerText;

    recentArr.push(str);

    recentStr = JSON.stringify(recentArr);

    localStorage.setItem('recentData', recentStr);
  };
  return (
    <div className="searchWrap" onClick={click}>
      <div className="searchBox">
        <div className="title">
          ?????? ?????? ???????????? ???????????? <br />
          ??????????????? ????????????
        </div>
        <div className="inputWrap">
          <input
            className="inputBox"
            placeholder="???????????? ??????????????????"
            onKeyUp={change}
            onKeyDown={keyDown}
          />
          <FontAwesomeIcon className="iconStyle" icon={faMagnifyingGlass} />
        </div>

        <div className={toggle ? 'dataWrap' : 'dataWrap hidden'}>
          <div className={data ? 'recent hidden' : 'recent'}>
            <div
              onClick={recentClick}
              className={
                tabIndex === 5 || tabIndex === -1 ? 'upper on' : 'upper'
              }
            >
              <FontAwesomeIcon
                className={inputText ? 'iconStyle' : 'iconStyle hidden'}
                icon={faMagnifyingGlass}
              />
              {inputText}
            </div>
            <div className="recentTitle">?????? ?????????</div>
            {recentArr &&
              recentArr.map((item, idx) => {
                if (idx < 3) {
                  return (
                    <div key={idx}>
                      <FontAwesomeIcon
                        className="icon"
                        icon={faMagnifyingGlass}
                      />
                      <span className="text">{item}</span>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
          <div className={data ? 'recommendArr hidden' : 'recommendArr'}>
            <div className="recommendText">?????????????????? ??????????????????</div>
            {recommendArr.map((item, idx) => {
              return <span key={idx}>{item}</span>;
            })}
          </div>
          <div
            onClick={recentClick}
            className={data && data.length ? 'dataList' : 'dataList hidden'}
          >
            <div className="under">?????? ?????????</div>
            {data && data.length !== 0
              ? data.map((item, idx) => {
                  return idx < 5 ? (
                    <div className="item">
                      <FontAwesomeIcon
                        className="iconStyle"
                        icon={faMagnifyingGlass}
                      />
                      <span
                        className={idx === tabIndex ? ' on' : null}
                        dangerouslySetInnerHTML={{ __html: item.sickNm }}
                        key={idx}
                      />
                    </div>
                  ) : null;
                })
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
};
let recentStr = '';
let recentArr = JSON.parse(localStorage.getItem('recentData')) || [];
const recommendArr = ['B??? ??????', '??????', '?????????', '?????????', '?????????'];

export default Search;
