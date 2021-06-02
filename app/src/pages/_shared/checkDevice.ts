export default function checkDevice(error: Error) {
  // for mobile users
  // as it is hard to debug mobile browser applications
  const mobileDevicesUA = [
    'iPhone',
    'Android',
    'Opera Mobi',
    'Opera Mini',
    'Windows Phone ',
    'Mobile Safari',
  ]
  const isMobile = mobileDevicesUA.some((item) =>
    navigator.userAgent.indexOf(item)
  )

  if (isMobile) {
    alert(error.message)
  }
}
