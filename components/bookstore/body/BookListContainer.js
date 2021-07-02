// import styles from "./BookListContainer.module.css";
import styled from "styled-components";

const BookListSectionWrapper = styled.section`
  max-width: 1000px;
  padding-top: 36px;
  padding-bottom: 36px;
  background: #1dbd38;
  margin: 0 auto;
  background-size: contain;
  & > .SectionTitle {
    color: white;
  }
`;

const SectionTitleText = styled.h2`
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 25px;
  padding-right: 8px;
  font-size: 19px;
  font-weight: normal;

  @media (max-width: 999px) {
    padding-left: 20px;
  }
  @media (max-width: 833px) {
    padding-left: 16px;
  }
`;

const DivForPosition = styled.div`
  position: relative;
  margin: 20px auto 0;
`;

const ContainerAdjustStyle = styled.div`
  position: relative;
  margin-top: -7px;
`;

const SlidingContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
`;
const ScrollBarHidden = styled(SlidingContainer)`
  overflow: -moz-scrollbars-none;
`;

const Marker = styled.div`
  flex: none;
  width: 1px;
`;

const Content = styled.div`
  flex: 1 0 auto;
`;

const BookList = styled.ul`
  flex: none;
  margin-left: 10px;
  padding-top: 7px;
  padding-left: 7px;
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;
  margin: 0px;
  padding: 0px;
`;

const BookWrapper = styled.li`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  min-width: 140px;
  width: 140px;
  margin-right: 12px;

  @media (max-width: 999px) {
    min-width: 100px;
    width: 100px;
  }
`;

const BookListContainer = ({ children, bg_color, ft_color, clock, type }) => {
  return (
    <BookListSectionWrapper>
      <SectionTitleText className="SectionTitle">집 앞 서점에 방금 나온 신간!</SectionTitleText>
      <div>
        <DivForPosition>
          <ContainerAdjustStyle>
            <ScrollBarHidden>
              <Marker></Marker>
              <Content>
                <BookList>
                  <BookWrapper>
                    <a href="/books/2416000179?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=0" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/2416000179/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/2416000179/small#1 50w, https://img.ridicdn.net/cover/2416000179/small#1 90w, https://img.ridicdn.net/cover/2416000179/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/2416000179/large#1 165w, https://img.ridicdn.net/cover/2416000179/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/2416000179/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/2416000179/xlarge#1 225w, https://img.ridicdn.net/cover/2416000179/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/2416000179/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/2416000179/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/2416000179/xxlarge#1 480w, https://img.ridicdn.net/cover/2416000179/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/2416000179/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="완전한 행복"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/2416000179?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=0">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">완전한 행복</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/3065">정유정</a>
                      </span>
                    </div>
                  </BookWrapper>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1242001043?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=1" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/1242001043/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/1242001043/small#1 50w, https://img.ridicdn.net/cover/1242001043/small#1 90w, https://img.ridicdn.net/cover/1242001043/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/1242001043/large#1 165w, https://img.ridicdn.net/cover/1242001043/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/1242001043/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/1242001043/xlarge#1 225w, https://img.ridicdn.net/cover/1242001043/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/1242001043/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/1242001043/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/1242001043/xxlarge#1 480w, https://img.ridicdn.net/cover/1242001043/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/1242001043/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="슈퍼히어로의 단식법"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1242001043?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=1">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">슈퍼히어로의 단식법</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118357">샘 J. 밀러</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/2639000050?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=2" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/2639000050/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/2639000050/small#1 50w, https://img.ridicdn.net/cover/2639000050/small#1 90w, https://img.ridicdn.net/cover/2639000050/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/2639000050/large#1 165w, https://img.ridicdn.net/cover/2639000050/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/2639000050/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/2639000050/xlarge#1 225w, https://img.ridicdn.net/cover/2639000050/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/2639000050/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/2639000050/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/2639000050/xxlarge#1 480w, https://img.ridicdn.net/cover/2639000050/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/2639000050/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="글쓰기의 쓸모"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/2639000050?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=2">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">글쓰기의 쓸모</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/search?q=%EC%86%90%ED%98%84">손현</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/3620000032?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=3" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/3620000032/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/3620000032/small#1 50w, https://img.ridicdn.net/cover/3620000032/small#1 90w, https://img.ridicdn.net/cover/3620000032/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/3620000032/large#1 165w, https://img.ridicdn.net/cover/3620000032/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/3620000032/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/3620000032/xlarge#1 225w, https://img.ridicdn.net/cover/3620000032/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/3620000032/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/3620000032/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/3620000032/xxlarge#1 480w, https://img.ridicdn.net/cover/3620000032/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/3620000032/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="밤에 찾아오는 구원자"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/3620000032?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=3">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">밤에 찾아오는 구원자</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/109709">천선란</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1780000346?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=4" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/1780000346/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/1780000346/small#1 50w, https://img.ridicdn.net/cover/1780000346/small#1 90w, https://img.ridicdn.net/cover/1780000346/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/1780000346/large#1 165w, https://img.ridicdn.net/cover/1780000346/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/1780000346/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/1780000346/xlarge#1 225w, https://img.ridicdn.net/cover/1780000346/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/1780000346/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/1780000346/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/1780000346/xxlarge#1 480w, https://img.ridicdn.net/cover/1780000346/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/1780000346/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="2029 기계가 멈추는 날"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1780000346?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=4">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">2029 기계가 멈추는 날</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118566">게리 마커스</a>,<a href="/author/118567">어니스트 데이비스</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/4321000264?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=5" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/4321000264/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/4321000264/small#1 50w, https://img.ridicdn.net/cover/4321000264/small#1 90w, https://img.ridicdn.net/cover/4321000264/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/4321000264/large#1 165w, https://img.ridicdn.net/cover/4321000264/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/4321000264/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/4321000264/xlarge#1 225w, https://img.ridicdn.net/cover/4321000264/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/4321000264/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/4321000264/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/4321000264/xxlarge#1 480w, https://img.ridicdn.net/cover/4321000264/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/4321000264/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="해방촌의 채식주의자"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/4321000264?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=5">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">해방촌의 채식주의자</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/search?q=%EC%A0%84%EB%B2%94%EC%84%A0">전범선</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/510001123?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=6" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <img
                            className="euy5vnf0 css-1w0zy2z-Thumbnail-StyledThumbnailWithBadge e119teyj1"
                            src="https://img.ridicdn.net/cover/510001123/large?dpi=xhdpi#1"
                            srcSet="https://img.ridicdn.net/cover/510001123/small#1 50w, https://img.ridicdn.net/cover/510001123/small#1 90w, https://img.ridicdn.net/cover/510001123/small?dpi=xhdpi#1 120w, https://img.ridicdn.net/cover/510001123/large#1 165w, https://img.ridicdn.net/cover/510001123/small?dpi=xxhdpi#1 180w, https://img.ridicdn.net/cover/510001123/large?dpi=xhdpi#1 220w, https://img.ridicdn.net/cover/510001123/xlarge#1 225w, https://img.ridicdn.net/cover/510001123/xlarge?dpi=xhdpi#1 300w, https://img.ridicdn.net/cover/510001123/large?dpi=xxhdpi#1 330w, https://img.ridicdn.net/cover/510001123/xlarge?dpi=xxhdpi#1 450w, https://img.ridicdn.net/cover/510001123/xxlarge#1 480w, https://img.ridicdn.net/cover/510001123/xxlarge?dpi=xhdpi#1 640w, https://img.ridicdn.net/cover/510001123/xxlarge?dpi=xxhdpi#1 960w"
                            sizes="(max-width: 999px) 100px, 140px"
                            alt="버닝 룸"
                          />
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/510001123?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=6">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">버닝 룸</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/16001">마이클 코넬리</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/862001562?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=7" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="종말 하나만 막고 올게"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/862001562?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=7">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">종말 하나만 막고 올게</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/18967">임태운</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/371002399?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=8" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="낮술"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/371002399?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=8">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">낮술</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118628">하라다 히카</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1546000833?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=9" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="크래프톤 웨이"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1546000833?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=9">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">크래프톤 웨이</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118592">이기문</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/754031849?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=10" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="타인의 집"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/754031849?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=10">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">타인의 집</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/78324">손원평</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/371002395?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=11" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="궤도의 밖에서, 나의 룸메이트에게"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/371002395?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=11">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">궤도의 밖에서, 나의 룸메이트에게</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/8968">전삼혜</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/375000084?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=12" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="개미도 무조건 돈 버는 주식투자 ETF가 답이다"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/375000084?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=12">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">개미도 무조건 돈 버는 주식투자 ETF가 답이다</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/114585">안석훈</a>, <a href="/author/118632">오기석</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1811187198?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=13" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="우리의 뇌는 어떻게 배우는가"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1811187198?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=13">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">우리의 뇌는 어떻게 배우는가</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118109">스타니슬라스 드앤</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/786000218?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=14" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="정신병의 나라에서 왔습니다"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/786000218?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=14">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">정신병의 나라에서 왔습니다</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118602">리단</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/852001084?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=15" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="우리말 어감사전"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/852001084?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=15">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">우리말 어감사전</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118071">안상순</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1568000081?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=16" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="호랑이를 덫에 가두면"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1568000081?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=16">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">호랑이를 덫에 가두면</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118436">태 켈러</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1473000087?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=17" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="까칠하고 공격적인 우리아이 육아법"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0"></div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1473000087?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=17">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">까칠하고 공격적인 우리아이 육아법</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/1819">이보연</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/606002325?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=18" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="쓸모없는 것들이 우리를 구할 거야"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/606002325?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=18">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">쓸모없는 것들이 우리를 구할 거야</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118374">김준</a>
                      </span>
                    </div>
                  </li>
                  <li className="css-11q2t56-PortraitBookWrapper-hotReleaseMargin euy5vnf1">
                    <a href="/books/1242001034?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=19" className="css-1pgxt7k-StyledAnchor euy5vnf3">
                      <div className="css-hd82zv-ThumbnailWrapper-StyledThumbnailWrapper euy5vnf2">
                        <div className="css-xygcns-ThumbnailWrapper e119teyj0">
                          <div className="euy5vnf0 css-1jmy61f-ThumbnailNoImg-Thumbnail-StyledThumbnailWithBadge e119teyj2" role="img" aria-label="생명의 물리학"></div>
                          <div className="css-16z6gac-BadgeContainer e13hsvzl0">
                            <div className="badge css-8ri59t-Badge-DiscountBadge e1omex4w3" role="img" aria-label="10% 할인">
                              <span className="css-dz5pqg-DiscountNumber e1omex4w4">10</span>
                              <span className="css-2jxqt-DiscountPercentage e1omex4w2">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                    <div className="css-1gehsul-Container e1a44y0s1">
                      <a href="/books/1242001034?_rdt_sid=home-general-hotrelease&amp;_rdt_idx=19">
                        <div className="css-zvon8l-BookTitle-bookTitleStyle-BookMetaBase e1a44y0s0">생명의 물리학</div>
                      </a>
                      <span color="#9EA7AD" className="css-1uat6kc-AuthorsWrapper e1a44y0s2">
                        <a href="/author/118301">찰스 S. 코켈</a>
                      </span>
                    </div>
                  </li>
                </BookList>
              </Content>
              <div className="css-147ezuq-Marker epsecci2"></div>
            </ScrollBarHidden>
          </ContainerAdjustStyle>
        </DivForPosition>
      </div>
    </BookListSectionWrapper>
  );
};

export default BookListContainer;

{
  /* // <section className={styles.BookListContainer} style={{ background: bg_color ? "rgb(228, 61, 105)" : "white" }}>
 // <h2 className={styles.BookSectionTitle} style={{ color: ft_color ? "rgb(248, 238, 241)" : "black" }}>
 // {clock}집 앞 서점에 방금 나온 신간
 // </h2>
 // {type === "carousel" ? ( */
}
{
  /* // <div className={styles.BookListWraper}>
 // <div className={styles.BookListCarouselWrapper}>
 // <ul className={styles.BookListCarousel}>{children}</ul>
 // </div>
 // </div>
 // ) : (
 // <div className={styles.BookListWraper}>
 // <div className={styles.BookListTableWrapper}>
 // <div className={styles.SlidingContainer}>
 // <div className={styles.BookListTable}>
 // <ul className={styles.BookListGrid}>{children}</ul>
 // </div>
 // </div>
 // </div>
 // </div>
 // )}
 // </section> */
}
