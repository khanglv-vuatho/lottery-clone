export type TListFeature = {
  title: string
  thumb: string
  isBgWhite?: boolean
  childrenDrawer?: React.ReactNode
  headerDrawer?: React.ReactNode
  position?: string
}

export type TListCountDonw = {
  title: string
  time: string
}

export type TListRank = {
  title: string
  thumb: string
}

export type THeaderDrawer = {
  thumb: string
  title: string
}

export type TListPromotion = {
  title: string
  desc: string
  thumb: string
  thumbPromotion: string
}

export type TListTicketOfUser = {
  uuid: string
  numberTicker: string[]
}
