import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import InputWrap from '../components/InputWrap';
import axios from 'axios';
import './Search.scss';

// 중복 실행 방지
let timer = null;
// 추천검색어
const recommendArr = ['B형간염', '비만', '관절염', '우울', '식도염'];
// 최근 검색어
let recentStr = '';
let recentArr = JSON.parse(sessionStorage.getItem('recentData')) || [];
recentArr.reverse();

const Search = () => {
  const [keyword, setKeyword] = useState([]);
  const [inputText, setInputText] = useState('');
  const [toggle, setToggle] = useState(false);

  /**
   * 질병 통신
   * @param {*} params 검색 키워드
   */
  const callData = params => {
    axios
      // .get(`http://localhost:4000/sick?q=${params}`)
      .get(`https://json-server-beryl.vercel.app/api/sick?q=${params}`)
      .then(respon => {
        console.log('Respon', respon);
        setHighlight(respon, params);
      })
      .catch(() => {
        console.log('fail');
      });
  };

  /**
   * 검색어 하이라이트
   * @param {*} respon 검색 응답값
   * @param {*} params 검색 키워드
   */
  const setHighlight = (respon, params) => {
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
    setKeyword(newData);
  };

  /**
   * 검색어 변경
   * @param {*} e 이벤트 객체
   */
  const inputChange = e => {
    // 키워드 삭제
    if (e.currentTarget.className === 'deleteBtn') {
      setInputText('');
      return;
    }

    // 키워드 정상 입력
    let str = e.target.value;
    setInputText(str);
    setData(str);
    console.log('Keyword', str);
    if (str) {
      setToggle(true);
    }
  };

  /**
   * 데이터 셋팅
   */
  const setData = str => {
    setInputText(str);

    if (str.length > 0) {
      let blank_pattern = /^\s+|\s+$/g;
      if (str.replace(blank_pattern, '') === '') {
        return false;
      }

      // 중복 실행 방지
      clearTimeout(timer);
      timer = setTimeout(function () {
        callData(str);
      }, 300);
    } else {
      setKeyword(null);
    }
  };
  /**
   * 검색 박스 보이기
   * @param {*} e 이벤트 객체
   */
  const showBox = e => {
    if (e.target.className === 'inputBox') {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  /**
   * 검색 버튼 클릭
   * @param {*} e
   * @returns
   */
  const searchBtnClick = e => {
    let str = inputText;
    if (str === '') {
      return;
    }

    setInputText('');
    setData('');
    recentArr.push(str);
    recentStr = JSON.stringify(recentArr);
    sessionStorage.setItem('recentData', recentStr);
  };

  /**
   * 검색 키워드 아이템 클릭
   * @param {*} e
   */
  const clickKeywordItem = e => {
    let str = e.target.innerText;
    setInputText(str);
    setData(str);
  };
  /**
   * 인풋 엔터키 입력
   * @param {*} e 이벤트 객체
   */

  const keyDown = e => {
    if (e.keyCode === 13) {
      searchBtnClick();
    }
  };

  return (
    <div className="searchWrap" onClick={showBox}>
      <div className="searchBox">
        <div className="title">
          국내 모든 임상시험 검색하고 <br />
          온라인으로 참여하기
        </div>

        {/* 입력 영역 */}
        <InputWrap
          searchBtnClick={searchBtnClick}
          inputChange={inputChange}
          keyDown={keyDown}
          inputText={inputText}
        />

        {/* 결과 영역 */}
        <div className={toggle ? 'infoWrap' : 'infoWrap hidden'}>
          <div className="infoInner">
            {/* 최근 검색어 */}
            <div
              className={inputText.length ? 'recentWrap hidden' : 'recentWrap'}
            >
              <div className="recentTitle">최근 검색어</div>
              {recentArr.length ? (
                recentArr.map((item, idx) => {
                  if (item && idx < 5) {
                    return (
                      <div
                        key={idx}
                        className="item"
                        onClick={clickKeywordItem}
                      >
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
                })
              ) : (
                <div className="recentText">최근검색어가 없습니다</div>
              )}
            </div>

            {/* 추천 검색어 */}
            <div
              className={
                inputText.length ? 'recommendWrap hidden' : 'recommendWrap'
              }
            >
              <div className="recommendTitle">추천검색어로 검색해보세요</div>
              <div className="recommendList">
                {recommendArr.map((item, idx) => {
                  return (
                    <button type="button" key={idx} onClick={clickKeywordItem}>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 현재 검색어 */}
            <div
              className={
                inputText.length
                  ? 'recentSearchText'
                  : 'recentSearchText hidden'
              }
            >
              <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
              <span className="text">{inputText}</span>
            </div>

            {/* 검색 결과 */}
            <div
              className={
                inputText.length && keyword && keyword.length
                  ? 'searchResultList'
                  : 'searchResultList hidden'
              }
            >
              <div className="searchResultTitle">추천 검색어</div>
              {keyword &&
                keyword.length !== 0 &&
                keyword.map((item, idx) => {
                  return idx < 5 ? (
                    <div className="item" key={idx} onClick={clickKeywordItem}>
                      <FontAwesomeIcon
                        className="icon"
                        icon={faMagnifyingGlass}
                      />
                      <span
                        dangerouslySetInnerHTML={{ __html: item.sickNm }}
                        key={idx}
                      />
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
