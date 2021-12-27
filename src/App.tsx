import { useEffect, useRef, useState } from 'react';
interface ITime {
  hour: number, minute: number, second: number
}
type TTimerStatus = 'paused' | 'counting'
type TTimeType = keyof ITime
const timeData: { [propName: string]: { max: number, min: number } } = {
  'hour': {
    max: 99, min: 0
  },
  'minute': {
    max: 59, min: 0
  },
  'second': {
    max: 59, min: 0
  },
}
function Timer(props: { id: number, deleteTimer: (id: number) => void }) {
  // console.log(`timer${props.id} render`)
  const [timerStatus, setTimerStatus] = useState<TTimerStatus>('paused')
  const [nowTime, setNowTime] = useState<ITime>({
    hour: 0, minute: 0, second: 0
  })
  const startCountingTimeSecond = useRef(0)
  const remainingTimeSecond = useRef(0)
  const intervalIdRef = useRef<number | null>(null)
  const verifyTime = (type: TTimeType, num: number) => {
    if (Number.isInteger(num) &&
      num >= timeData[type].min &&
      num <= timeData[type].max
    ) {
      return true
    }
    return false
  }
  const turnSecondIntoITimeObj = (_second: number): ITime => {
    const second = _second % 60
    const minute = ((_second - second) / 60) % 60
    const hour = (_second - (minute * 60) - second) / (60 * 60)
    return {
      second,
      minute,
      hour
    }
  }
  const handleSetInterval = () => {
    const intervalId = window.setInterval(() => {
      handleCountingRef.current()
    }, 1000)
    intervalIdRef.current = intervalId
  }
  const handleClearInterval = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current)
      intervalIdRef.current = null
    }
  }
  const handleClickPause = () => {
    if (timerStatus !== 'counting') {
      return
    }
    setTimerStatus('paused')
    handleClearInterval()
  }
  const handleTimerEnd = () => {
    setTimerStatus('paused')
    handleClearInterval()
    alert(`計時器${props.id}結束`)
  }
  const handleCounting = () => {
    if (remainingTimeSecond.current === 0) {
      handleTimerEnd()
      return
    }
    const nextRemainingTimeSecond = remainingTimeSecond.current - 1
    const nextTime = turnSecondIntoITimeObj(nextRemainingTimeSecond)
    setNowTime(nextTime)
    remainingTimeSecond.current = nextRemainingTimeSecond
  }
  const handleCountingRef = useRef(handleCounting)
  const handleSetNowTime = (second: number) => {
    const timeObj = turnSecondIntoITimeObj(second)
    setNowTime(timeObj)
    startCountingTimeSecond.current = second
    remainingTimeSecond.current = second
  }
  const handleInputChangeTime = (type: TTimeType, value: string) => {
    if (timerStatus === 'counting') {
      return
    }
    const num = Number(value)
    if (!verifyTime(type, num)) {
      return
    }
    const newTime = { ...nowTime, [type]: num }
    const newTimeSecond = newTime.hour * 60 * 60 + newTime.minute * 60 + newTime.second
    handleSetNowTime(newTimeSecond)
  }
  const handleClickStart = () => {
    if (timerStatus === 'counting') {
      return
    }
    handleSetInterval()
    setTimerStatus('counting')
  }
  const handleClickReset = () => {
    handleClickPause()
    handleSetNowTime(startCountingTimeSecond.current)
  }
  const handleClickDelete = () => {
    props.deleteTimer(props.id)
    handleClearInterval()
  }
  useEffect(() => {
    handleCountingRef.current = handleCounting
  })
  useEffect(() => {
    return () => {
      handleClearInterval()
    }
  }, [])
  return (
    <div className="main">
      <div className="">
        <div className="">計時器{props.id}</div>
        <input type="number" style={{ width: 50 }} step={1} value={nowTime.hour} onChange={(e) => handleInputChangeTime('hour', e.target.value)} />小時
        :
        <input type="number" style={{ width: 50 }} step={1} value={nowTime.minute} onChange={(e) => handleInputChangeTime('minute', e.target.value)} />分鐘
        :
        <input type="number" style={{ width: 50 }} step={1} value={nowTime.second} onChange={(e) => handleInputChangeTime('second', e.target.value)} />秒
      </div>
      <div className="">
        <button disabled={timerStatus === 'counting'} onClick={() => handleClickStart()}>開始</button>
        <button disabled={timerStatus === 'counting'} onClick={() => handleClickReset()}>重設</button>
        <button disabled={timerStatus === 'paused'} onClick={() => handleClickPause()}>暫停</button>
        <button onClick={() => handleClickDelete()}>刪除</button>
      </div>
    </div>
  )
}
function TimerGroup() {
  const maxTimerNum = 6
  const timerIdRef = useRef<number>(1)
  const [timerDataList, setTimerDataList] = useState<{ id: number }[]>([])
  const handleAppendTimer = () => {
    if (timerDataList.length >= maxTimerNum) {
      return
    }
    setTimerDataList([...timerDataList, { id: timerIdRef.current }])
    timerIdRef.current += 1
  }
  const handleDeleteTimer = (id: number) => {
    const targetTimerIndex = timerDataList.findIndex(timerData => timerData.id === id)
    const listCopy = [...timerDataList]
    listCopy.splice(targetTimerIndex, 1)
    setTimerDataList(listCopy)
  }
  useEffect(() => {
    handleAppendTimer()
  }, [])
  return (
    <div className="timerGroup">
      <div>
        <button onClick={() => handleAppendTimer()} disabled={timerDataList.length >= maxTimerNum}>增加計時器</button>
        <div>
          計時器數量 {timerDataList.length}/{maxTimerNum}
        </div>
      </div>
      <div>{
        timerDataList.length === 0 ?
          <h1>沒有計時器</h1>
          :
          timerDataList.map(timerData => (
            <div key={timerData.id} style={{ padding: 10 }}>
              <Timer id={timerData.id} deleteTimer={handleDeleteTimer} />
            </div>
          ))
      }</div>

    </div>
  )
}

function App() {
  return (
    <div className="App">
      <TimerGroup />
    </div>
  );
}

export default App;
