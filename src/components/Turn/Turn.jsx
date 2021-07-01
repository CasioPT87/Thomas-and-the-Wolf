import cx from 'classnames';
import styles from './Turn.module.css';

const Turn = ({ manager }) => {
  return (
    <div className={styles.wrapper} >
      <div
        className={cx(styles.turn, styles.tom, {
          [styles['not-selected']]: !manager.isTomTurn()
        })}
      >Tom's turn</div>
      <div
        className={cx(styles.turn, styles.wolf, {
          [styles['not-selected']]: manager.isTomTurn()
        })}
      >Wolf's turn</div>
    </div>
  )
} 

export default Turn;
