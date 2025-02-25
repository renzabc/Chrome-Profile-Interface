import { ReactElement, useState } from 'react'
import './App.css'

function App() {
  // Define Type for Profile or else there will be errors when array is empty and types cannot be assumed
  interface Profile {
    name: string;
    icon: ReactElement;
    exePath: string;
    folderPath: string;
  }

  const [browserArray, setBrowserArray] = useState([{ name: 'chrome' }])
  const [profileArray, setProfileArray] = useState<Profile[]>([])

  // Logic for addimg browser profiles
  let handleAddProfile = async (browserType: string) => {
    setProfileArray(prevArray => {
      let newProfile: Profile = {
        name: '',
        icon: <></>,
        exePath: '',
        folderPath: ''
      }
      if (browserType == 'chrome') {
        newProfile = {
          name: String(prevArray.length),
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="15" width="20">
              <defs>
                <linearGradient id="a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#d93025" />
                  <stop offset="1" stop-color="#ea4335" />
                </linearGradient>
                <linearGradient id="b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#fcc934" />
                  <stop offset="1" stop-color="#fbbc04" />
                </linearGradient>
                <linearGradient id="c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#1e8e3e" />
                  <stop offset="1" stop-color="#34a853" />
                </linearGradient>
              </defs>
              <circle className='fill-white' cx="24" cy="23.9947" r="12" />
              <path d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z" className='fill-white' />
              <path d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z" className='fill-red-500' />
              <circle cx="24" cy="24" r="9.5" className='fill-blue-500' />
              <path d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z" className='fill-yellow-500' />
              <path d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z" className='fill-green-500' />
            </svg>
          ),
          exePath: 'C:\Program Files\Google\Chrome\Application\chrome.exe',
          folderPath: ''
        }
      }
      return [...prevArray, newProfile]
    })
  }

  let browserButtons = browserArray.map((browser) => {
    if (browser.name == 'chrome') {
      return (
        <button className='p-1 flex flex-row bg-white hover:bg-green-100 rounded-lg'
          onClick={() => handleAddProfile('chrome')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="15" width="20">
            <defs>
              <linearGradient id="a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#d93025" />
                <stop offset="1" stop-color="#ea4335" />
              </linearGradient>
              <linearGradient id="b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#fcc934" />
                <stop offset="1" stop-color="#fbbc04" />
              </linearGradient>
              <linearGradient id="c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#1e8e3e" />
                <stop offset="1" stop-color="#34a853" />
              </linearGradient>
            </defs>
            <circle className='fill-white' cx="24" cy="23.9947" r="12" />
            <path d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z" className='fill-white' />
            <path d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z" className='fill-red-500' />
            <circle cx="24" cy="24" r="9.5" className='fill-blue-500' />
            <path d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z" className='fill-yellow-500' />
            <path d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z" className='fill-green-500' />
          </svg>
          <svg className="fill-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
          </svg>

        </button>

      )
    }
  })



  let profileCards = profileArray.map((profile) => (
    <div className='bg-white h-[60px] w-[50px]'>
      {profile.name}
    </div>
  ))




  return (
    <>
      <div className='flex flex-col'>

        {/* Title Bar */}
        <div className='titleBar flex flex-row gap-1 justify-end bg-neutral-800 '>
          {/* Add Browser Profile Button(s) */}
          <div className='p-1'>
            {browserButtons}
          </div>
          <div className='flex grow justify-center'>
            <h1 className='text-white'>Profile Interface</h1>
          </div>
          {/* settings button */}
          <button className=''>
            <svg className='fill-neutral-200 hover:fill-sky-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
              <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
              <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
            </svg>
          </button>

          {/* minimize */}
          <button className=''>
            <svg className='fill-neutral-200 hover:fill-green-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
              <path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z"></path>
              <path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6"></path>
              <path d="M15 13h-4v-4"></path>
              <path d="M11 13l5 -5"></path>
            </svg>
          </button>

          {/* maximize */}
          <button className=''>
            <svg className='fill-neutral-200 hover:fill-yellow-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
              <path d="M3 16m0 1a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1z"></path>
              <path d="M4 12v-6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-6"></path>
              <path d="M12 8h4v4"></path>
              <path d="M16 8l-5 5"></path>
            </svg>
          </button>

          {/* close */}
          <button className=''>
            <svg className='fill-neutral-200 hover:fill-red-500' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
              <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z"></path>
              <path d="M9 9l6 6m0 -6l-6 6"></path>
            </svg>
          </button>
        </div>

        {/* Profiles Container */}
        <div className='flex flex-wrap content-start bg-neutral-200 h-[calc(100vh-31px)] w-[] p-4 gap-4 overflow-auto '>
          {profileCards}
        </div>
      </div>
    </>
  )
}

export default App
