import React from "react";
import { expect, test ,describe,it} from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe("home test",()=>{
    it("home test",()=>{
        render(<Home/>)
        screen.debug()
    })
    it("check if header have good text",()=>{
        render(<Home/>) 
        expect(screen.getByRole("heading")).toHaveTextContent('hello world')
    })
})
