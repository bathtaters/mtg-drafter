export const matchWidth = /^\[--card-w:([0-9\.]+)rem\]/

const cardZoomLevels = [
  '[--card-w:11.45rem] [--card-h:16rem] [--card-sz:0.69rem]',
  '[--card-w:12.89rem] [--card-h:18rem] [--card-sz:0.78rem]',
  '[--card-w:14.32rem] [--card-h:20rem] [--card-sz:0.87rem]',
  '[--card-w:15.75rem] [--card-h:22rem] [--card-sz:0.95rem]',
  '[--card-w:17.18rem] [--card-h:24rem] [--card-sz:1.04rem]', /* Default [4] */
  '[--card-w:18.61rem] [--card-h:26rem] [--card-sz:1.13rem]',
  '[--card-w:20.05rem] [--card-h:28rem] [--card-sz:1.21rem]',
  '[--card-w:21.48rem] [--card-h:30rem] [--card-sz:1.3rem]',
  '[--card-w:22.91rem] [--card-h:32rem] [--card-sz:1.38rem]',
  '[--card-w:24.34rem] [--card-h:34rem] [--card-sz:1.47rem]',
  '[--card-w:25.77rem] [--card-h:36rem] [--card-sz:1.56rem]',
  '[--card-w:27.2rem]  [--card-h:38rem] [--card-sz:1.64rem]',
  '[--card-w:28.64rem] [--card-h:40rem] [--card-sz:1.73rem]',
  '[--card-w:30.07rem] [--card-h:42rem] [--card-sz:1.82rem]',
  '[--card-w:31.5rem]  [--card-h:44rem] [--card-sz:1.9rem]',
  '[--card-w:32.93rem] [--card-h:46rem] [--card-sz:1.99rem]',
  '[--card-w:34.36rem] [--card-h:48rem] [--card-sz:2.08rem]',
]
// Ratio = 63[w]:88[h]

/** Default zoom level, formatted for CSS (Copied from cardZoomLevels[4]) */
export const initialValues = '--card-w: 17.18rem; --card-h: 24rem; --card-sz: 1.04rem;'

export const splitRatios = ['h-[70%]', 'w-[70%]'] // 63/88, 88/63 * 50% (for split cards)

export default cardZoomLevels