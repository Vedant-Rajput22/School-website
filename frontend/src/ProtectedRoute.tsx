import React from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedIn } from './auth'

export default function ProtectedRoute({ children }:{ children: React.ReactElement }){
  if(!isLoggedIn()) return <Navigate to="/admin" replace />
  return children
}

