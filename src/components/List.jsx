import React from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import '../css/List.css';

const List = (props) => {
  const {
    data,
    drillOpenInfo,
    drillDoneItem,
    drillDeleteItem,
  } = props;


  // TODO: Optimize this.
  // Sort by date before rendering.
  data.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) return -1;
    return 1;
  });

  // Sort by done
  data.sort((a, b) => {
    if (a.done && !b.done) return 1;
    return -1;
  });

  return (
    <section className="List">
      <div className="itemContainer">
        {data.map(item => (
          <Item
            item={item}
            key={item.link}
            drillOpenInfo={drillOpenInfo}
            drillDoneItem={drillDoneItem}
            drillDeleteItem={drillDeleteItem}
          />
        ))}
      </div>
    </section>
  );
};

List.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    link: PropTypes.string,
    date: PropTypes.string,
    notes: PropTypes.string,
    done: PropTypes.bool,
  })),
  drillOpenInfo: PropTypes.func,
  drillDoneItem: PropTypes.func,
  drillDeleteItem: PropTypes.func,
};

List.defaultProps = {
  data: [],
  drillOpenInfo: (() => { throw new ReferenceError('drillOpenInfo not passed to List'); }),
  drillDoneItem: (() => { throw new ReferenceError('drillDoneItem not passed to List'); }),
  drillDeleteItem: (() => { throw new ReferenceError('drillDeleteItem not passed to Item'); }),
};

export default List;
