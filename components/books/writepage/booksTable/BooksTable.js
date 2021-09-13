/* eslint-disable react/display-name */
import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';

// todo 버튼 만들어서 useMutation부분 옮겨보자

const BooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const [foldedCategory, setFoldedCatgegory] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const booksArr = myBook.map((book) => {
      const cate = category.filter((_cate) => _cate._id === book.mybook_info.mybookcate_id)[0];

      const cateLength = myBook.filter((_book) => _book.mybook_info.mybookcate_id === cate._id).length;

      const cateInfo = cate.mybookcate_info;
      return {
        ...book.mybook_info,
        category: cateInfo.name,
        categorySeq: cateInfo.seq,
        cateLength: cateLength,
        _id: book._id,
        key: book._id,
      };
    });

    const sortingBySeq = booksArr.sort((_cateA, _cateB) => _cateA.seq_in_category - _cateB.seq_in_category);

    const sortingByCate = sortingBySeq.sort((_cateA, _cateB) => _cateA.categorySeq - _cateB.categorySeq);
    setDataSource(sortingByCate);
  }, [myBook]);

  const columns = [
    {
      title: '카테고리',
      key: 'category',
      className: 'categoryCol',
      dataIndex: 'category',

      render: (txt, record, index) => {
        return record.seq_in_category == 0 ? txt : null;
        // 부모 자식 컴포로 접기 펼치기 구현 하면 될듯 !!!! 그리고 부모 rowCol은 자식 갯수만큼
        // 자식 rowCol은 모두 0처리하면 될듯!!!! 자식인지 판단하는 것은 seq_in_cate > 0 으로 판단하면 될듯

        // const obj = {
        //   children: (
        //     <>
        //       <div
        //         style={{ cursor: 'pointer' }}
        //         onClick={() => {
        //           if (foldedCategory.includes(_record.mybookcate_id)) {
        //             setFoldedCatgegory(foldedCategory.filter((cate_id) => cate_id != _record.mybookcate_id));
        //             // myBook에서 해당 카테고리 책만 불러서 dataSource같은 형식의 배열로 만든다.
        //             // dataSource에서 해당카테고리를 제외한 데이터를 만든다.
        //             // 위에 두개의 데이터를 합친다
        //             // 정렬을 다시한다
        //             // 끝
        //             console.log(newArr);
        //           } else {
        //             const newCate = [...foldedCategory, _record.mybookcate_id];
        //             setFoldedCatgegory(newCate);
        //             const booksIdsInThisCate = dataSource
        //               .filter((_book) => _book.mybookcate_id == _record.mybookcate_id && _book.seq_in_category !== 0)
        //               .map((book) => book._id);
        //             const newDataSso = dataSource.filter((book) => !booksIdsInThisCate.includes(book._id));

        //             setDataSource(newDataSso);
        //           }
        //         }}
        //       >
        //         <CaretDownOutlined rotate={foldedCategory.includes(_record.mybookcate_id) ? 270 : 0} />
        //         {_txt}
        //       </div>
        //     </>
        //   ),
        //   props: {},
        // };
        // if (foldedCategory.includes(_record.mybookcate_id)) {
        //   obj.props.rowSpan = 1;
        // } else if (_record.seq_in_category === 0) {
        //   obj.props.rowSpan = _record.cateLength;
        // } else {
        //   obj.props.rowSpan = 0;
        // }

        // return obj;
      },
    },
    {
      title: '책 제목',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '제목 변경',
      key: 'title',
      dataIndex: 'title',
      render: (_title, _record) => (
        <BookTitleChange
          mybook_id={_record._id}
          title={_title}
          hide_or_show={_record.hide_or_show}
          isPopupSomething={isPopupSomething}
          chagePopup={chagePopup}
          handleToGetMyBook={handleToGetMyBook}
        />
      ),
    },
    {
      title: '책순서',
      render: (txt, _record) => <BookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} />,
    },
    {
      title: '책순서',
      key: 'seq_in_category',
      dataIndex: 'seq_in_category',
    },
  ];

  return (
    <Table
      dataSource={dataSource.length > 0 ? dataSource : undefined}
      columns={columns}
      size="small"
      pagination={false}
      // rowSelection을 첫번째 행에서 옮기는 것은 안되고 styled에서 selection 애들 모두 display:none 처리하고
      // 체크 박스로 같이 처리해보자 자세한건 세션설정에서 썼던 코드 참고해서 짜보자
      rowClassName={(record, index) => (record.cateLength - record.seq_in_category - 1 == 0 ? 'lastBook' : 'Books')}
      rowSelection={{ order: 2 }}
    />
  );
};

export default BooksTable;
