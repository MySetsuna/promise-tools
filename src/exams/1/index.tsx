/**
 * 第一题
 */
import  { FC, useCallback, useEffect, useState } from 'react';
import './style.less';

/**
 * 渲染测试数据
 */
export const cardDataList: IDirectVoucher[] = [
  {
    title: '杭州市通用5元券',
    subTitle:
      '杭味面馆非常好吃，太好吃了，相当不错，味道鲜美，特别划算，快快抢购，聚划算杭味面馆非常好吃，太好吃了，相当不错，味道鲜美，特别划算，快快抢购，聚划算',
  },
  {
    title: '杭州市10元券',
    subTitle: '兰州拉面非常好吃',
  },
];

/**
 * 券卡片渲染数据类型
 */
export interface IDirectVoucher {
  /** 标题 */
  title?: string;
  /** 副标题 */
  subTitle?: string;
}

export interface ICardProps {
  data: IDirectVoucher;
}

/**
 * 卡片组件
 */
const Card: FC<ICardProps> = (props) => {
  // -------- 在这里完成代码 --------
  const { data } = props;
  const [bntNubmer, setBntNumber] = useState(10);
  const [bntText, setBntText] = useState('抢购');
  const trunTimes = useCallback(() => {
    if (bntNubmer > 0) {
      setBntNumber(bntNubmer - 1);
    }
  }, [bntNubmer]);

  const fetchData = useCallback(() => {
    return new Promise((resovle) => {
      setTimeout(() => {
        resovle('成功');
      }, 1000);
    });
  }, []);

  const handleClick = useCallback(() => {
    if (bntNubmer === 0 && bntText === '抢购') {
      fetchData().then((data) => {
        if (data === '成功') {
          setBntText('已抢购');
        }
      });
    }
  }, [bntNubmer, bntText, fetchData]);
  useEffect(() => {
    if (bntNubmer) {
      setTimeout(trunTimes, 1000);
    }
  }, [bntNubmer, trunTimes]);
  return (
    <div className="card">
      <div className="title-box">
        <div className="title">{data.title}</div>
        <div className="subTitle">{data.subTitle}</div>
      </div>
      <div className="button" onClick={handleClick}>
        {bntNubmer > 0 ? `${bntNubmer}s` : bntText}
      </div>
    </div>
  );
};

/**
 * 以下为测试用例，无需修改
 */
// eslint-disable-next-line react-refresh/only-export-components
export default () =>
  cardDataList.map((data) => <Card key={data.title} data={data} />);
