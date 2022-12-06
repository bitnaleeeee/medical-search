# 질환명 검색시 API 호출 통해서 검색어 추천 기능 구현

- ## 배포 링크 : [https://bitnaleeeee.github.io/wanted-pre-onboarding-fe-7/](https://bitnaleeeee.github.io/wanted-pre-onboarding-fe-7/)

### STACK

<img src="https://img.shields.io/badge/JavaScript-FFCA28?style=flat-square&logo=javascript&logoColor=white"/><img src="https://img.shields.io/badge/React.js-58c3cc?style=flat-square&logo=React&logoColor=white"/><img alt="SASS" src ="https://img.shields.io/badge/SASS-CC6699.svg?&style=flat-square&logo=Sass&logoColor=white"/><img src="https://img.shields.io/badge/aws(EC2)-F6BB43?style=flat-square&logo=amazonaws&logoColor=white"/>
<img src="https://img.shields.io/badge/git-F05032?style=flat-square&logo=git&logoColor=white"><img src="https://img.shields.io/badge/github-181717?style=flat-square&logo=github&logoColor=white"><img src="https://img.shields.io/badge/fontawesome-339AF0?style=for-flat-square&logo=fontawesome&logoColor=white">

## 목차

- [프로젝트의 실행](#프로젝트의실행)
- [구현 목표](#구현목표)
- [실행 결과](#실행결과)
- [폴더 구조](#폴더구조)
- [구현 사항](#구현사항)

---

</br>

## 프로젝트의실행

```
$ npm install
$ npm start
```

## 구현 목표

- [x] 사용자가 검색한 텍스트와 일치하는 부분 볼드처리
- [x] 검색어가 없을 시 “검색어 없음” 표출
- [x] API 호출 최적화
- [x] 키보드만으로 추천 검색어들로 이동 가능하도록 구현
- [x] 캐싱 기능을 제공하는 라이브러리(React-Query)등을 사용 하지 않고 API 호출별로 로컬 캐싱 구현
- [x] 키보드 만으로 추천검색으로 이동 구현
- [x] API를 호출할 때 마다 console.info("calling api") 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정

</br>

## 실행결과

</br>

<img src="https://user-images.githubusercontent.com/99943583/195349755-8e6d0b85-a0d5-4f3a-8b77-bc1300316b21.gif">

</br>

## 폴더구조

```
📦 src
├── 📂 pages
│   ├──📜 Search.js
│   ├──📜 Search.scss
│
├── 📜 index.js
└── 📜 Router.js
```

</br>

## 구현 사항

<br>

- ### 사용자가 입력한 텍스트와 일치하는 부분 볼드처리

```javascript
const bold = (respon, params) => {
  let newData = [];
  let responData = respon.data;

  responData.forEach(function (item) {
    let regex = new RegExp(params, 'gi');
    let result = item.sickNm.replace(regex, '<strong>' + params + '</strong>');
    newData.push({
      sickNm: result,
    });
  });
  setData(newData);
};
```

정규식을 이용하여 사용자가 입력한 검색어와 데이터가 일치하는 부분을 찾도록 작성한 후
앞, 뒤로 `<strong>` 태그를 넣어주었습니다.

</br>

- ### API 호출 최적화

```javascript
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
```

입력창 `input`태그에 값을 입력할때마다 이벤트를 발생시켜 API이 포함된 로직을 호출하지 않도록 `Debounce ` 를 통해 연이어 호출되는 함수들 중 가장 마지막 함수만 호출되도록 작성하였습니다.
이를 통해 클라이언트와 서버에서 불필요한 AIP 호출 횟수를 줄였습니다.

</br>

- ### API 호출별로 로컬 캐싱 구현

```javascript
const recentClick = e => {
  let str = e.target.innerText;

  recentArr.push(str);

  recentStr = JSON.stringify(recentArr);

  localStorage.setItem('recentData', recentStr);
};
```

최근 검색어를 담을 빈 `String` `recnetStr` 와 `localStorage`에 저장할 최근 검색어 배열 `recentArr` 을 전역 변수에 먼저 선언해주어 `input` 검색창에 검색 후 클릭했을 시 `push`로 배열화 되어 `localStorage`에 저장된 후 최근검색어에 사용자가 검색한 이력 데이터가 3개 까지만 노출 되도록 작성하였습니다.

```javascript
//[JSX]
let recentStr = '';
let recentArr = JSON.parse(localStorage.getItem('recentData')) || [];

<div onClick={recentClick}
 className={data && data.length ? 'dataList' : 'dataList hidden'}
 >

<div className="recentTitle">최근 검색어</div>
{recentArr && recentArr.map((item, idx) => {
   if (idx < 3) {
     return (
       <div key={idx}><FontAwesomeIcon
      className="icon" icon={faMagnifyingGlass}/>
      <span className="text">{item}</span>
  </div>
```
