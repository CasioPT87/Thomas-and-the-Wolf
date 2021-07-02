import cx from 'classnames';
import styles from './Turn.module.css';

const Turn = ({ manager }) => {
  return (
    <div data-testid='turn' className={styles.wrapper} >
      <div
        id='tom turn'
        className={cx(styles.turn, styles.tom, {
          [styles['selected']]: manager.isTomTurn()
        })}
      >Tom's turn</div>
      <div
        id='wolf turn'
        className={cx(styles.turn, styles.wolf, {
          [styles['selected']]: !manager.isTomTurn()
        })}
      >Wolf's turn</div>
    </div>
  )
} 

export default Turn;
