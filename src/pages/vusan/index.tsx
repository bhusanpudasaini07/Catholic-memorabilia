import Button from '@/shared/components/button';
import React, { useEffect, useState } from 'react'

const VusanPage = () => {
  const [vusan, setVusan] = useState<number>(0);


  return (
      <>
      <Button onClick={() => setVusan(vusan + 5)}>Click me</Button>
      <p>{vusan}</p>
      </>
  )
}

export default VusanPage