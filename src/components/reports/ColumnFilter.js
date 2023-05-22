
import * as React from 'react';
import { Form, TileGroup, Tile, TextInput, Button, Select, SelectItem } from '@carbon/react';
import './carbonStyle.scss';


const ColumnFilter = ({ headerData, filterByColumn }) => {

    const [filterKey, setFilterKey] =  React.useState('')
    const [operatorName, setOperatorName] =  React.useState('')
    const [filterValue, setFilterValue] =  React.useState('')

    React.useEffect(()=> {

        filterByColumn(filterKey, operatorName, filterValue)

    }, [filterValue])

    //filterKey, operatorName, 

    return (

        <div class="cds--grid">

            <div class="cds--row">
                <div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">
                    <Select
                        // value={''}
                        labelText="Select Column"
                        required
                        id="column"
                        onChange={(e) => {
                            setFilterKey(e.target.value)
                        }}
                    >
                       <SelectItem value={''} text={'Select a Column'} />

                        {headerData?.map((cell) => (
                            <SelectItem value={cell.key} text={cell.header} />
                        ))}
                    </Select>
                </div>
                <div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">
                    <Select
                        //   value={''}
                        labelText="Select Operator"
                        required
                        id="operatorName"
                        value={operatorName}
                        onChange={(e) => {
                            setOperatorName(e.target.value)
                        }}
                    >
                        <SelectItem value={''} text={'Select a Operator'} />
                        <SelectItem value={'contains'} text={'Contains'} />
                        <SelectItem value={'equals'} text={'Equals'} />
                        <SelectItem value={'startswith'} text={'Starts with'} />
                        <SelectItem value={'endswith'} text={'Ends with'} />
                        <SelectItem value={'isempty'} text={'Is empty'} />
                        <SelectItem value={'isnotempty'} text={'Is not empty'} />
                        <SelectItem value={'isanyof'} text={'Is any of'} />

                    </Select>
                </div>
                <div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">
                    <TextInput
                        value={filterValue}
                        id="filterValue"
                        onChange={(e) => setFilterValue(e.target.value)}
                        invalidText="Invalid error message."
                        labelText={'Search Value'}
                        placeholder='type search value'

                    />
                </div>
                {/* <div class="cds--col-lg-4 cds--col-md-2 cds--col-sm-1">
                        <Button> Search </Button>
                </div> */}
            </div>
        </div>


    )
}

export default ColumnFilter;



{/* <div  style={{width: "300px"}}>


           <Select
            value={''}
            labelText="Select Column"
            required
          
            onChange={(e) => {
               // setExclusionType(e.target.value)
            }}
        >
            <SelectItem value={''} text={'Check Section'} />
            <SelectItem value={'approved change ticket'} text={'Approved Change Ticket'} />
            <SelectItem value={'non-compliance issue'} text={'Non-Compliance Issue'} />
            <SelectItem value={'csd deviation'} text={'CSD Deviation'} />
            <SelectItem value={'Risk Letter'} text={'Risk Letter'} />
            <SelectItem value={'client managed'} text={'Client Managed'} />
            <SelectItem value={'other'} text={'Other'} />
        </Select>
    </div>*/}