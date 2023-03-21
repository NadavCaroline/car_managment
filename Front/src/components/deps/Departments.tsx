import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { userAccess } from '../login/loginSlice'
import { depsSelector, getDepsAsync } from './depsSlicer'

const Departments = () => {

  const dispatch = useAppDispatch()
  const deps = useAppSelector(depsSelector)
  const token  = useAppSelector(userAccess)

  useEffect(() => {
    dispatch(getDepsAsync(token))
  }, [deps.length])
  

  return (
    <div>
      
      {deps.map(dep => <div key={dep.id}>
          {dep.name}
        </div>)}
    </div>
  )
}

export default Departments