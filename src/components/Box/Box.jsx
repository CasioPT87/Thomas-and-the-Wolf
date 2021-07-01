import { useEffect, useState } from 'react'
import cx from 'classnames';
import styles from './Box.module.css';

const DIRECTIONS = ['up', 'down', 'left', 'right'];

const Box = ({ data, manager, onClick }) => {

  const borderStyles = DIRECTIONS.filter(direction => !data.canMove(direction)).map(direction => styles[`blocked--${direction}`]);
  
  return (
    <div 
      data-testid="box" 
      onClick={() => onClick(data.id)}
      className={cx(styles.box, ...borderStyles, {
        [styles.tom]: manager.isCurrentTomBox(data.id),
        [styles.wolf]: manager.isCurrentWolfBox(data.id),
      })}
    >
        {data.index}
    </div>
  )
} 

export default Box;
