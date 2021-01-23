import React from 'react'
import './Table.css'
import numeral from 'numeral'

function Table( {states} ) {

    return <div className='table'>
        {states.map( ({state, cases}) => 
        <tr>
        <td>{state}</td>
        <td><strong>{numeral(cases).format('0,0')}</strong></td>
        </tr>
        )}
    </div>
    
}

export default Table
