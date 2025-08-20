# Netflix clone
노마드 코더 react-masterclass 강의 프로젝트

### 기술 스택<br>
typescript, react, react-query, styled-components, react-router, framer-motion

### 구현 기능<br>
(framer-motion)
- 넷플릭스 로고에 호버할 시 로고가 깜박거리는 애니메이션
- 스크롤바로 화면을 밑으로 내릴 시 header 부분이 자연스럽게 검정색으로 변하는 애니메이션
- 검색 아이콘 svg를 누르면 input창이 나타나는 애니메이션
- 헤더의 Home이나 TV shows를 누르면 밑의 빨간 점이 누른 메뉴의 밑으로 이동하는 애니메이션
- 슬라이더의 영화 box를 누르면 box가 자연스럽게 커지면서 가운데로 이동하여 세부 정보를 보여주는 애니메이션

(react-query)
- react-query를 이용해 tmdb api에서의 영화 목록 및 세부 내용 등의 data와 로딩 여부를 알리는 isLoading을 가져옴

(react-router)
- Home 메뉴를 누르면 Home 화면이, TV shows 메뉴를 누르면 TV shows 화면(이 화면은 아직 구현되지 않았음)이 나오도록 함
- useHistory를 이용해 Box를 누르면 /movies/:movieId 경로로 이동하도록 함