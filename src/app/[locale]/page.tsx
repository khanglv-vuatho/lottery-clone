/* eslint-disable react/display-name */
'use client'

import { memo, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useAnimate } from 'framer-motion'

import CountUp from 'react-countup'
import { Avatar, Button, Tab, Tabs } from '@nextui-org/react'
import { ArrowLeft, People } from 'iconsax-react'
import Countdown from 'react-countdown'
import { uuid } from 'uuidv4'
import { useLocale, useTranslations } from 'next-intl'

import {
  THeaderDrawer,
  TListCountDown,
  TListFeature,
  TListPromotion,
  TListRank,
  TListTicketOfUser,
} from '@/type'
import Drawer from '@/components/Drawer'
import { Polium } from '@/components/Icons'
import { useUnfocusItem } from '@/hooks'
import { mapOrder, mergePairs } from '@/utils'
import instance from '@/services/axiosConfig'

import './lottery.css'
import LotteryMachine from '@/components/LotteryMachine'
import { twMerge } from 'tailwind-merge'
import Head from 'next/head'

function Lottery() {
  const t = useTranslations('Lottery')

  //index of listrank
  const [currentRank, setCurrentRank] = useState<number>(4)

  const [isOpenResult, setIsOpenResult] = useState<boolean>(false)

  const [onFetching, setOnFetching] = useState(false)

  const [initalDataFromApi, setInitalDataFromApi] = useState<any>({})

  const tabsResult = [
    {
      id: t('tabsResult.text1'),
      label: t('tabsResult.text1'),
      content: <BodyTabResult />,
    },
    {
      id: t('tabsResult.text2'),
      label: t('tabsResult.text2'),
      content: <MyTicket />,
    },
  ]

  const listFeature: TListFeature[] = [
    {
      title: t('listFeature.text1'),
      thumb: 'result.png',
    },
    {
      title: t('listFeature.text2'),
      thumb: 'prize.png',
      childrenDrawer: <BodyDrawerPrize />,
      headerDrawer: (
        <HeaderDrawer thumb='prize-mini.png' title={t('listFeature.text2')} />
      ),
    },
    {
      title: t('listFeature.text3'),
      thumb: 'ticket.png',
      childrenDrawer: <BodyTicket />,
      headerDrawer: (
        <HeaderDrawer thumb='ticket-mini.png' title={t('listFeature.text4')} />
      ),
      position: 'translate-y-[64%]',
    },
  ]

  const listRank: TListRank[] = [
    {
      title: t('listRank.text1'),
      thumb: 'rank1.png',
    },
    {
      title: t('listRank.text2'),
      thumb: 'rank2.png',
    },
    {
      title: t('listRank.text3'),
      thumb: 'rank3.png',
    },
  ]

  //fetching inital data
  const _HandleFetching = async () => {
    try {
      // const {data} = await instance.get('lottery/time')
      const data: any = {
        auctionTime: Date.now() + 5000,
        name: 'Huy 123',
        participants: 1200,
        rank: 1,
        bingo: ['2', '3', '1', '5', '3', '7', '4', '9', '4', '2', '8', '0'],
      }

      const timeCaculator = data?.auctionTime - Date.now()
      const isPast = timeCaculator < 0
      const currentIndexBall = Math.floor(
        ((timeCaculator / 1000) * -1) / timeDefine.TIME_ANIMATION_BALL,
      )

      setIndexSpiner(isPast ? currentIndexBall + 1 : 0)
      // setIndexSpiner(11)

      if (currentIndexBall >= data?.bingo?.length) {
        setCurrentRank(data?.rank - 1)
      }

      setInitalDataFromApi(data)
      setBingo(data?.bingo)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  useEffect(() => {
    onFetching && _HandleFetching()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  //animation zone
  const startRef: any = useRef()
  const [scope, animate] = useAnimate()
  const [onTimeEnd, setOnTimeEnd] = useState(false)
  const [indexSpiner, setIndexSpiner] = useState(0)
  const [indexNumber, setIndexNumber] = useState(0)

  const [onStartAnimate, setOnStartAnimate] = useState(false)
  const [onChangeNumber, setOnChangeNumber] = useState(false)

  const [onStart, setOnStart] = useState<boolean>(false)

  const [isSmallScreen, setIsSmallScreen] = useState(false)

  //data from api
  const [bingo, setBingo] = useState([])

  // list "?" 12 numbers
  const initListDefault = Array(12).fill('?')
  const [listBingo, setListBingo] = useState(initListDefault)

  useEffect(() => {
    // Update listBingo based on bingo array
    if (initalDataFromApi?.auctionTime) {
      // const timeCaculator = initalDataFromApi?.auctionTime - Date.now()
      // const isPast = timeCaculator < 0
      // const currentIndexBall = Math.floor(((timeCaculator / 1000) * -1) / 18)

      if (indexSpiner <= 11) {
        setListBingo((prevListBingo) =>
          prevListBingo.map((item, index) =>
            index <= indexSpiner - 1 ? bingo[index] : item,
          ),
        )
      } else {
        setListBingo(bingo)
      }
    }
  }, [initalDataFromApi])

  const timeDefine: any = useMemo(() => {
    const ROUNDS = 10
    const ONE_ROUND_DEG = 360
    const TOTAL_ROUND = ONE_ROUND_DEG * ROUNDS
    const TIME = TOTAL_ROUND / ONE_ROUND_DEG
    const TIME_STOP = 4
    const DELAY_TIME = 0.5
    const TOTAL_TIME = TIME + TIME_STOP + DELAY_TIME
    const TIME_ANIMATION_BALL = 21

    return {
      ROUNDS,
      ONE_ROUND_DEG,
      TOTAL_ROUND,
      TIME,
      TIME_STOP,
      TOTAL_TIME,
      TIME_ANIMATION_BALL,
    }
  }, [])

  useEffect(() => {
    if (onTimeEnd) {
      setCurrentRank(initalDataFromApi?.rank - 1)
      animate([
        [
          scope.current,
          { rotate: timeDefine.TOTAL_ROUND * (indexSpiner + 1), opacity: 1 },
          {
            duration: timeDefine.TIME,
            ease: 'linear',
            repeat: Infinity,
            delay: timeDefine.DELAY_TIME,
          },
        ],
        [
          scope.current,
          { rotate: timeDefine.TOTAL_ROUND * (indexSpiner + 1) + 720 },
          { duration: timeDefine.TIME_STOP / 2, ease: 'linear' },
        ],
        [
          scope.current,
          { rotate: timeDefine.TOTAL_ROUND * (indexSpiner + 1) + 720 + 360 },
          { duration: timeDefine.TIME_STOP / 2 },
        ],
      ])
      startRef.current = setTimeout(() => {
        _HandleStart()
      }, 500)
    }

    return () => {
      clearTimeout(startRef.current)
    }
  }, [onTimeEnd])

  const sphereRef: any = useRef()

  const _HandleStart = () => {
    sphereRef.current?.start()
    setOnStart(true)
    setOnChangeNumber(false)
    setOnStartAnimate(false)
  }

  const refChangeNumber: any = useRef()
  const refOnTimeEnd: any = useRef()

  const _HandleStop = () => {
    setOnStart(false)
    setIndexNumber(indexSpiner)
    setOnTimeEnd(false)
    setOnStartAnimate(true)

    // kiểm tra xem có settimeout chưa có thì clear
    if (refChangeNumber.current) {
      clearTimeout(refChangeNumber.current)
    }
    refChangeNumber.current = setTimeout(() => {
      setOnChangeNumber(true)
    }, 2000)

    //Quay hết các cặp số thì return null
    // chỗ này ngăn vì không cho chạy xuống dưới setOnTimeEnd(true)
    if (indexSpiner + 1 === listBingo.length) {
      return null
    }
    refOnTimeEnd.current = setTimeout(() => {
      setOnTimeEnd(true)
      setOnStartAnimate(false)
    }, 4000)
  }

  const _HandleReset = () => {
    setOnFetching(true)
    //4 là không có rank
    setCurrentRank(4)
    setListBingo(initListDefault)
    animate([
      [
        scope.current,
        { rotate: 0, opacity: 0 },
        {
          duration: 0.00000001,
        },
      ],
      [
        scope.current,
        { rotate: 0, opacity: 1 },
        {
          duration: 0.00000001,
        },
      ],
    ])
  }

  const _HandleChangeNumber = () => {
    console.log(indexSpiner + 1 === listBingo.length)

    setListBingo((prevList) => {
      const newList = [...prevList]
      newList[indexSpiner] = bingo[indexSpiner]
      return newList
    })
    //Quay hết các cặp số thì return null vì phải đợi setListBingo hiển thin ra kết quả nên phải ngăn thêm tại chỗ này
    if (indexSpiner + 1 === listBingo.length) {
      _HandleReset()
      return null
    }
    setIndexSpiner((prevIndex) => prevIndex + 1)
    setOnChangeNumber(false)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024)
    }
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    onChangeNumber && _HandleChangeNumber()
  }, [onChangeNumber])

  return (
    <>
      {/* <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        />
      </Head> */}
      <p className='hidden rounded border border-red-400 bg-red-100 p-4 text-red-700 lg:block'>
        {t('notSupport')}
      </p>
      {isSmallScreen && (
        <div className='ct-container-game h-screen pt-10 lg:hidden overflow-hidden relative max-w-[390px]'>
          <div className='absolute left-[calc(-50vw+50%)] w-[100vw]'>
            <Image src={'/lottery/money.png'} alt='money' width={505} height={400} />
          </div>
          <div
            className={`relative z-0 top-[40px] flex flex-col items-center transition ${
              isOpenResult ? 'translate-x-[-110%]' : 'translate-x-0'
            }`}
          >
            <div className='absolute top-[-25%] z-20 pl-[5%]'>
              <Image src={'/lottery/title.png'} alt='title' width={193} height={83} />
            </div>
            <div className='absolute inset-0 top-[5%] z-20 gap-2 '>
              {onFetching ? (
                <></>
              ) : (
                <div className='absolute top-0 z-20 bg-white left-1/2 -translate-x-1/2 p-4 rounded-2xl flex flex-col gap-4'>
                  {currentRank <= 3 ? (
                    <div className='flex items-center gap-2 justify-center'>
                      <div className='mr-1'>
                        <Image
                          src={`/lottery/${listRank[currentRank].thumb}`}
                          alt={`${listRank[currentRank].title}`}
                          className='min-h-[24px] min-w-[20px]'
                          width={20}
                          height={24}
                        />
                      </div>
                      <p className='text-base-black-1 font-semibold '>
                        {listRank[currentRank].title}
                      </p>
                    </div>
                  ) : (
                    <>
                      {initalDataFromApi.auctionTime ? (
                        <h3 className='text-center font-semibold'>
                          {t('ListCountDonw.text5')}
                        </h3>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                  <CountDown
                    auctionTime={initalDataFromApi.auctionTime}
                    index={indexSpiner}
                    setOnTimeEnd={setOnTimeEnd}
                    type='special'
                  />
                </div>
              )}
            </div>
            <div className='relative z-10 inset-0 flex items-center justify-center'>
              <div className='absolute inset-0'>
                <LotteryMachine
                  key={indexSpiner}
                  config={{
                    numberBalls: 10,
                    targetIndex: +bingo[indexSpiner] - 1,
                    // times total of animation (ms)
                    times: (timeDefine.TIME + timeDefine.TIME_STOP / 2) * 1000,
                  }}
                  ref={sphereRef}
                  onEnd={_HandleStop}
                />
              </div>

              <Image src={'/lottery/glass.png'} alt='glass' width={320} height={320} />
              <motion.div ref={scope} className='absolute w-[290px]'>
                <Image src={'/lottery/bar.png'} alt='bar' width={290} height={55} />
              </motion.div>
            </div>
            <div className='absolute top-[82%]'>
              <div className='relative flex flex-col items-center'>
                <Image
                  src={'/lottery/body.png'}
                  width={358}
                  height={388}
                  alt='body'
                  className='h-[388px] w-[358px]'
                />
                <div className='absolute top-[30%] flex flex-col items-center gap-4'>
                  <div className='flex h-[75px] items-center rounded-xl bg-[#81B3FF] p-4 shadow-[0px_1px_2px_0px_rgba(255,255,255,0.50)_inset,0px_-1px_1px_0px_rgba(255,255,255,0.25)_inset]'>
                    <Hole
                      onStartAnimate={onStartAnimate}
                      numberBingo={bingo[indexNumber]}
                    />
                  </div>
                  <div className='flex w-full flex-col gap-4 px-2'>
                    <div className='flex gap-3 justify-center items-center '>
                      {!!mergePairs(listBingo).length &&
                        mergePairs(listBingo).map((item: any, index: any) => (
                          <BallNumber number={item} key={index} style='size-10' />
                        ))}
                    </div>
                    <div className='grid w-full grid-cols-3 py-2 pl-2'>
                      <div className='col-span-2 flex items-center gap-2'>
                        <span className=''>
                          <People size={24} className='text-white' />
                        </span>
                        <p className=' font-light text-white'>{t('main.text2')}</p>
                      </div>
                      <p className='col-span-1 flex justify-center font-semibold text-white'>
                        <CountUp
                          end={initalDataFromApi?.participants || 1000}
                          duration={2}
                        />
                      </p>
                    </div>
                    <div className='grid grid-cols-3 pl-2'>
                      <div className='col-span-2 flex items-center gap-2'>
                        <span className=''>
                          <Polium className='text-white' />
                        </span>
                        <p className=' font-light text-white'>{t('main.text3')}</p>
                      </div>
                      <div className='col-span-1 flex h-10 w-full items-center justify-center rounded-[10px] border-1 border-white max-w-[100px] overflow-hidden'>
                        <p className='line-clamp-1 px-2 text-sm font-semibold text-white'>
                          {initalDataFromApi?.name || '...'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`absolute top-[6%] transition w-full ${
              isOpenResult ? 'translate-x-0' : 'translate-x-[110%]'
            }`}
          >
            <Button
              isIconOnly
              radius='full'
              className='bg-gradient-to-br from-[#FFF8E6] via-[#FFB300] to-[#FFCB51]'
              onClick={() => setIsOpenResult(false)}
            >
              <ArrowLeft size={16} className='text-bold text-base-black-1' />
            </Button>
            <div className='relative pr-8'>
              <Tabs
                aria-label='Dynamic tabs result'
                items={tabsResult}
                radius='full'
                variant='light'
                classNames={{
                  base: 'w-full justify-center',
                  tab: ' text-base bg-white/10 py-5 px-6',
                  cursor: 'w-full group-data-[selected=true]:bg-white',
                  tabContent:
                    'group-data-[selected=true]:text-[#06b6d4] group-data-[selected=true]:font-medium text-white group-data-[selected=true]:text-primary-blue',
                  panel: 'px-0',
                }}
              >
                {(item) => (
                  <Tab key={item.id} title={item.label}>
                    {item.content}
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>
          <div className='fixed bottom-0 left-0 right-0 z-[1] flex max-full items-center justify-center bg-gradient-to-r from-[#4D7FFF] via-[#8AB4FF] to-[#3E75FF]'>
            <div className='grid grid-cols-3 items-center justify-center gap-8 p-4 w-[390px]'>
              {listFeature.map((item, index) => {
                if (index === 0) {
                  return (
                    <Result
                      item={item}
                      key={item.title}
                      setIsOpenResult={setIsOpenResult}
                    />
                  )
                }
                return <ItemFeature key={item.title} item={item} />
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const Hole = ({
  onStartAnimate,
  numberBingo,
}: {
  onStartAnimate: boolean
  numberBingo: any
}) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (!onStartAnimate) return
    if (scope.current && onStartAnimate) {
      animate([
        ['.text-ball', { scale: 1, top: 0 }, { duration: 0.0000001 }],
        [
          '.ball',
          { top: '36%', translate: 180, opacity: 1 },
          { duration: 0.5, ease: 'linear' },
        ],
        [scope.current, { overflow: 'unset' }, { duration: 1, ease: 'linear' }],
        [
          '.ball',
          { scale: 2, top: '-250%', zIndex: 10 },
          { duration: 1, ease: 'linear' },
        ],
        ['.text-ball', { scale: 2 }, { duration: 1, ease: 'linear', at: '<' }],
        ['.ball', { opacity: 0 }, { duration: 0.5, ease: 'linear', delay: 0.5 }],
        //reset animtion default state
        ['.ball', { opacity: 0, top: '-36%', scale: 1 }, { duration: 0.0000001 }],
        ['.text-ball', { scale: 1, top: 0 }, { duration: 0.0000001 }],
      ])
    }
  }, [onStartAnimate])

  return (
    <div className='relative '>
      <div className='relative overflow-hidden' ref={scope}>
        <div className='flex flex-col items-center justify-center'>
          {/* top-70% banh lăn xong top-[-36%] banh bắt đầu lăn */}
          <div className={`absolute top-[-36%] ball`}>
            <div className='relative inset-0 flex items-center justify-center'>
              <Image
                src={'/lottery/ball.png'}
                alt='ball'
                width={35}
                height={35}
                className='absolute min-h-[35px] min-w-[35px] ball'
              />
              <p className='absolute text-black z-30 flex items-center justify-center min-h-[35px] min-w-[35px] text-ball text-sm'>
                {numberBingo}
              </p>
            </div>
          </div>
        </div>
        <Image src={'/lottery/hole.png'} alt='hole' width={41} height={50} />
      </div>
      <Image
        src={'/lottery/bulkhead.png'}
        alt=''
        width={41}
        height={16}
        className='absolute bottom-[-4%] min-h-[16px] min-w-[41px] z-20'
      />
    </div>
  )
}

const ItemFeature = ({ item }: { item: TListFeature }) => {
  const [isOpen, setIsOpen] = useState(false)

  const exclusionRef = useRef(null)
  const itemRef = useUnfocusItem(() => {
    setIsOpen(false)
  }, exclusionRef)

  return (
    <div>
      <div
        className='relative flex items-center justify-center'
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={`/lottery/${item.thumb}`}
          alt=''
          width={60}
          height={60}
          className='min-h-[60px] min-w-[60px]'
        />
        <h3 className='ct-text-border absolute bottom-[-8%] font-bold text-white whitespace-nowrap'>
          {item.title}
        </h3>
      </div>
      <div className='' ref={itemRef}>
        <Drawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          header={item.headerDrawer}
          position={item?.position}
        >
          {item.childrenDrawer}
        </Drawer>
      </div>
    </div>
  )
}

const HeaderDrawer: React.FC<THeaderDrawer> = ({ thumb, title }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='h-[30px] w-[30px]'>
        <Image src={`/lottery/${thumb}`} alt='' width={30} height={30} />
      </div>
      <p className='text-base-black-1 font-semibold'>{title}</p>
    </div>
  )
}

const BodyDrawerPrize = () => {
  const t = useTranslations('Lottery.BodyDrawerPrize')
  const listPromotion: TListPromotion[] = [
    {
      title: t('text1'),
      desc: t('text2'),
      thumb: 'rank1.png',
      thumbPromotion: 'number1.png',
    },
    {
      title: t('text3'),
      desc: t('text4'),
      thumb: 'rank2.png',
      thumbPromotion: 'number2.png',
    },
    {
      title: t('text5'),
      desc: t('text6'),
      thumb: 'rank3.png',
      thumbPromotion: 'number3.png',
    },
  ]
  return (
    <div className='flex flex-col gap-4'>
      {listPromotion.map((item) => (
        <div className='grid grid-cols-3 items-center py-2 first:py-0' key={item.title}>
          <div className='flex items-center gap-2 col-span-2'>
            <div className=''>
              <Image
                src={`/lottery/${item.thumb}`}
                alt={item.thumb}
                width={32}
                height={40}
                className='w-[32px] h-[40px] flex-shrink-0'
              />
            </div>
            <div className='flex flex-col gap-1'>
              <h3 className='font-light text-base-black-1'>{item.title}</h3>
              <p className='font-semibold text-base-black-1'>{item.desc}</p>
            </div>
          </div>
          <div className='flex items-center justify-end'>
            <Image
              src={`/lottery/${item.thumbPromotion}`}
              alt={item.thumbPromotion}
              width={100}
              height={100}
              className='min-w-[90px]'
            />
          </div>
        </div>
      ))}
    </div>
  )
}

const BodyTicket = () => {
  const listTicketOfUserInitial: TListTicketOfUser[] = [
    {
      uuid: uuid(),
      numberTicker: ['01', '02', '04', '05', '07', '12'],
    },
    {
      uuid: uuid(),
      numberTicker: ['45', '12', '54', '5', '51', '12'],
    },
    {
      uuid: uuid(),
      numberTicker: ['45', '12', '55', '65', '23', '63'],
    },
    {
      uuid: uuid(),
      numberTicker: ['45', '12', '55', '65', '23', '63'],
    },
    {
      uuid: uuid(),
      numberTicker: ['45', '12', '55', '65', '23', '63'],
    },
    {
      uuid: uuid(),
      numberTicker: ['45', '12', '55', '65', '23', '63'],
    },
    {
      uuid: uuid(),
      numberTicker: ['45', '12', '55', '65', '23', '63'],
    },
  ]
  const [listTicketOfUser, setListTicketOfUser] = useState<TListTicketOfUser[]>([])

  const [onFetching, setOnFetching] = useState(false)

  const _HandleFetching = async () => {
    try {
      // const { data } = await instance.get('/lottery/ticket')
      // setListTicketOfUser(data)
      setListTicketOfUser(listTicketOfUserInitial)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    onFetching && _HandleFetching()
  }, [])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      {!!listTicketOfUser?.length ? (
        listTicketOfUser?.map((item, index) => (
          <div
            key={index}
            className='rounded-lg bg-[#C5E0FF] p-4 grid grid-cols-6 items-center '
          >
            {item.numberTicker.map((itemNumber, index: number) => (
              <BallNumber number={itemNumber} key={`number-ticket-${index}`} />
            ))}
          </div>
        ))
      ) : (
        <NoTicket />
      )}
    </div>
  )
}

const CountDownItem = ({ item }: { item: any }) => {
  return (
    <div className='flex flex-col items-center gap-1 min-w-[45px]'>
      <p className='text-[12px] text-base-black-1'>{item.title}</p>
      <div className='flex aspect-square h-[32px] w-[32px] items-center justify-center rounded-[4px] bg-base-black-1 text-xs font-bold text-white'>
        {item.time}
      </div>
    </div>
  )
}

const CountDown = memo(
  ({
    setOnTimeEnd,
    auctionTime,
    type = 'default',
    index,
  }: {
    setOnTimeEnd?: any
    auctionTime: number
    type?: string
    index?: any
  }) => {
    const t = useTranslations('Lottery.ListCountDonw')
    const td = useTranslations('Lottery')

    const [mounted, setMounted] = useState(false)

    const renderer = useMemo(
      () =>
        ({
          days,
          hours,
          minutes,
          seconds,
          completed,
        }: {
          days: number
          hours: number
          minutes: number
          seconds: number
          completed: boolean
        }) => {
          if (completed) {
            if (setOnTimeEnd) {
              setOnTimeEnd(true)
              return null
            }
          }
          const formattedDays = String(days).padStart(2, '0')
          const formattedHours =
            type === 'default'
              ? String(hours + +formattedDays * 24).padStart(2, '0')
              : String(hours).padStart(2, '0')
          const formattedMinutes = String(minutes).padStart(2, '0')
          const formattedSeconds = String(seconds).padStart(2, '0')

          const listItem: TListCountDown[] = [
            {
              title: t('text1'),
              time: formattedDays,
            },
            {
              title: t('text2'),
              time: formattedHours,
            },
            {
              title: t('text3'),
              time: formattedMinutes,
            },
            {
              title: t('text4'),
              time: formattedSeconds,
            },
          ]

          if (type === 'default') {
            return (
              <>
                <p className='text-primary-blue font-semibold'>{td('main.text1')}</p>
                <p className='text-primary-blue font-semibold'>{`${formattedHours}:${formattedMinutes}:${formattedSeconds}`}</p>
              </>
            )
          } else if (type === 'special') {
            return (
              <div className='mt-2 flex justify-center gap-4'>
                {listItem.map((item) => (
                  <CountDownItem item={item} key={item.title} />
                ))}
              </div>
            )
          }
        },
      [],
    )

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) return null
    if (index >= 12) return null

    return <Countdown date={auctionTime} renderer={renderer} />
  },
)

const Result = ({
  item,
  setIsOpenResult,
}: {
  item: TListFeature
  setIsOpenResult: any
}) => {
  return (
    <div
      className='relative flex items-center justify-center'
      onClick={() => setIsOpenResult(true)}
    >
      <Image
        src={`/lottery/${item.thumb}`}
        alt=''
        width={60}
        height={60}
        className='min-h-[60px] min-w-[60px]'
      />
      <h3 className='ct-text-border absolute bottom-[-8%] font-bold text-white whitespace-nowrap'>
        {item.title}
      </h3>
    </div>
  )
}

const NoTicket = () => {
  const t = useTranslations('Lottery.NoTicket')
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className=''>
        <Image
          src={'/lottery/noTicket.png'}
          alt='no-ticket'
          width={100}
          height={100}
          className='w-[100px] h-[100px]'
        />
      </div>
      <p className=''>{t('text1')}</p>
      <Button
        className='text-base-black-1 w-full bg-primary-yellow font-medium text-base'
        radius='full'
      >
        {t('text2')}
      </Button>
    </div>
  )
}

const BodyTabResult = () => {
  const listResultInitial = [
    {
      uuid: uuid(),
      title: 'Đợt 3',
      time: '1/2/2024',
    },
    {
      uuid: uuid(),
      title: 'Đợt 2',
      time: '1/3/2024',
      users: [
        {
          uuid: uuid(),
          name: 'Huy',
          thumb: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
          rank: '3',
          listNumber: [
            { number: '12' },
            { number: '43' },
            { number: '21' },
            { number: '54' },
            { number: '65' },
            { number: '87' },
          ],
        },
        {
          uuid: uuid(),
          name: 'Tính',
          thumb: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
          rank: '2',
          listNumber: [
            { number: '65' },
            { number: '23' },
            { number: '56' },
            { number: '21' },
            { number: '43' },
            { number: '75' },
          ],
        },
        {
          uuid: uuid(),
          name: 'Bao',
          thumb: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          rank: '1',
          listNumber: [
            { number: '65' },
            { number: '21' },
            { number: '34' },
            { number: '45' },
            { number: '61' },
            { number: '23' },
          ],
        },
      ],
    },
    {
      uuid: uuid(),
      title: 'Đợt 1',
      time: '21/12/2023',
      users: [
        {
          uuid: uuid(),
          name: 'Huy',
          thumb: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
          rank: '3',
          thumbRank: 'rank3.png',
          listNumber: [
            { number: '12' },
            { number: '43' },
            { number: '21' },
            { number: '54' },
            { number: '65' },
            { number: '87' },
          ],
        },
        {
          uuid: uuid(),
          name: 'Tính',
          thumb: 'https://i.pravatar.cc/150?u=a04258a2462d826712d',
          rank: '2',
          thumbRank: 'rank2.png',
          listNumber: [
            { number: '65' },
            { number: '23' },
            { number: '56' },
            { number: '21' },
            { number: '43' },
            { number: '75' },
          ],
        },
        {
          uuid: uuid(),
          name: 'Bao',
          thumb: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
          rank: '1',
          thumbRank: 'rank1.png',
          listNumber: [
            { number: '65' },
            { number: '21' },
            { number: '34' },
            { number: '45' },
            { number: '61' },
            { number: '23' },
          ],
        },
      ],
    },
  ]

  const [listResult, setListResult] = useState(listResultInitial)
  const [onFetching, setOnFetching] = useState(false)

  const fakeListUser = [
    {
      uuid: uuid(),
      name: '?',
      thumb: '',
      rank: '3',
      thumbRank: 'rank3.png',
      listNumber: Array(6).fill({ number: '??' }),
    },
    {
      uuid: uuid(),
      name: '?',
      thumb: '',
      rank: '2',
      thumbRank: 'rank2.png',
      listNumber: Array(6).fill({ number: '??' }),
    },
    {
      uuid: uuid(),
      name: '?',
      thumb: '',
      rank: '1',
      thumbRank: 'rank1.png',
      listNumber: Array(6).fill({ number: '??' }),
    },
  ]

  const listRankThumb: any = {
    '1': 'rank1.png',
    '2': 'rank2.png',
    '3': 'rank3.png',
  }
  const listColorRingAvatar: any = {
    '1': 'ring-[#FCB713]',
    '2': 'ring-[#E1E1E1]',
    '3': 'ring-[#CC7B72]',
  }

  const _HandleFetchingResult = async () => {
    try {
      // const { data } = await instance.get('/lottery/result', { params: { lang: locale } })
      // setListResult(data)
      const cloneData = [...listResultInitial]
      const firstArray = cloneData[0]
      // Thêm key 'users' vào mảng đầu tiên với giá trị là mảng fakeListUser
      firstArray['users'] = fakeListUser
      setListResult(listResultInitial)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    onFetching && _HandleFetchingResult()
  }, [onFetching])

  return (
    <div className='flex flex-col gap-4 overflow-auto pb-[70px] h-[calc(100vh_-_200px)] rounded-2xl w-full'>
      {listResult.map((item) => (
        <div key={item.uuid} className='flex flex-col gap-4 p-4 bg-white rounded-2xl'>
          <div className='flex items-center justify-between text-base-black-1'>
            <p className='font-medium'>{item.title}</p>
            <p className='font-light'>{item.time}</p>
          </div>
          <div className='flex justify-between items-end min-h-[140px]'>
            {!!item?.users?.length ? (
              mapOrder(item.users, ['3', '1', '2'], 'rank').map((item) => (
                <div key={item.uuid} className='flex flex-col gap-1 items-center'>
                  <Avatar
                    isBordered
                    src={item.thumb}
                    className={`aspect-square ${listColorRingAvatar[item.rank]} ${
                      item.rank === '1' ? 'w-28 h-28' : 'w-20 h-20'
                    }`}
                    classNames={{}}
                  />
                  <div className='overflow-hidden max-w-[60px]'>
                    <p className='text-base-black-1 font-medium line-clamp-1'>
                      {item.name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          <div className='flex flex-col gap-2 min-h-[193px]'>
            {!!item?.users?.length ? (
              item.users.map((item) => (
                <div
                  key={item.uuid}
                  className='grid grid-cols-3 items-center bg-[#FFF5DE] rounded-lg px-2 py-3'
                >
                  <div className='col-span-1 flex items-center gap-1'>
                    <div className=''>
                      <Image
                        src={`/lottery/${listRankThumb[item.rank + '']}`}
                        alt=''
                        width={20}
                        height={24}
                        className='w-[20px] h-[24px]'
                      />
                    </div>
                    <p className='text-base-black-1 font-medium'>{item.name}</p>
                  </div>
                  <div className='col-span-2 justify-end flex gap-1'>
                    {item?.listNumber?.map((item, index) => (
                      <BallNumber
                        number={item.number}
                        key={`list-number-winers-${index}`}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const MyTicket = () => {
  return (
    <div className='bg-white rounded-2xl p-4 max-h-[70vh] overflow-y-auto'>
      <BodyTicket />
    </div>
  )
}

const BallNumber = ({ number, style }: { number: string; style?: string }) => {
  return (
    <div className='flex items-center justify-center'>
      <div
        className={twMerge(
          'rounded-full bg-white text-base-black-1 h-[35px] w-[35px] aspect-square flex items-center justify-center col-span-1',
          style,
        )}
      >
        {number}
      </div>
    </div>
  )
}

export default Lottery
