import React from 'react'
import moment from 'moment'

import Loading from '../../../Common/Components/Loader'
import AgendaItem from '../AgendaItem'
import Button from '../../../Common/Components/Button'

import { MODAL_TYPE } from '../../Utils/adminTypes'
import { ITicket } from '../../../Common/Utils/globalTypes'
import { IProps, IState } from './types'
import './styles.scss'
import Pagination from 'src/App/Components/Pagination';

class Agenda extends React.Component<IProps, IState> {

  readonly state: IState = {
    header: 'spon-agenda__cell spon-agenda__cell--head'
  }

  handlePaginationOnClick = (page: number) => {
    this.props.handlePaginationClick(page)
  }

  
  prepareRows = () => {
    const {
      tickets, 
      filters, 
      changeActiveState, 
      openEditModal, 
      openModal
    } = this.props
    const filtered = tickets
    const segregated = filtered.reduce((acc, ticket: ITicket) => {
      const day = moment.utc(ticket.date.start).format('Y:M:D')
      if (day in acc) {
        acc[day].push(ticket)
      } else {
        acc[day] = [ticket]
      }
      return acc
    }, {})
    console.log('segregated', segregated)
    if (filters.length === 0) {
      return null
    } else {
      const row = Object.keys(segregated).map(key => {
        return segregated[key].map((ticket: ITicket, index: number) => (
          <AgendaItem
            key={index}
            ticket={ticket}
            index={index}
            rowSpan={segregated[key].length}
            changeActiveState={changeActiveState}
            openTicket={openEditModal}
            openModal={openModal}
          />
        ))
      })

      return row
    }
  }

  test = () => {
    const {header} = this.state

    this.props.filterString()

    if (header === 'spon-agenda__cell spon-agenda__cell--head') {
      this.setState({header: 'spon-agenda__cell spon-agenda__cell--head-border-bot'})
    }
    else if (header === 'spon-agenda__cell spon-agenda__cell--head-border-bot') {
      this.setState({header: 'spon-agenda__cell spon-agenda__cell--head-border-top'})
    }
    else if (header === 'spon-agenda__cell spon-agenda__cell--head-border-top') {
      this.setState({header: 'spon-agenda__cell spon-agenda__cell--head-border-bot'})
    }
  }

  render() {
    const {
    tickets,
    openModal,
    loading,
    error,
    retry,
    filters,
    pagination,
    } = this.props
    return (
      <table className="spon-agenda">
        <thead key="thead" className="spon-agenda__thead">
          <tr className="spon-agenda__row  spon-agenda__row--head">
            <th className="spon-agenda__cell spon-agenda__cell--head spon-agenda__cell--first-item">
              Date
            </th>
            <th className="spon-agenda__cell spon-agenda__cell--head">
              Time of departure
            </th>
            <th className="spon-agenda__cell spon-agenda__cell--head">
              Time of Arrival
            </th>
            <tr onClick={this.test} className={this.state.header}>From</tr>
            <th className="spon-agenda__cell spon-agenda__cell--head">To</th>
            <th className="spon-agenda__cell spon-agenda__cell--head">Carrier</th>
            <th className="spon-agenda__cell spon-agenda__cell--head">Type</th>
            <th className="spon-agenda__cell spon-agenda__cell--head">
              Qty of tickets
            </th>
            <th className="spon-agenda__cell spon-agenda__cell--head">
              Available tickets
            </th>
            <th className="spon-agenda__cell spon-agenda__cell--head">
              Sold tickets
            </th>
            
            <th className="spon-agenda__cell spon-agenda__cell--head">Active</th>
            <th className="spon-agenda__cell spon-agenda__cell--head">
              <Button
                className="spon-agenda__add-button"
                variant="blue"
                icon="plus"
                text="ADD NEW"
                onClick={() =>
                  openModal(MODAL_TYPE.ADD_TICKET, 'Create ticket', '')
                }
              />
            </th>
          </tr>
        </thead>
        <tbody className="spon-agenda__tbody">
          {error && (
            <tr>
              <td colSpan={5}>
                <div className="spon-agenda__error">
                  <p>There was a problem when we tried to find courses</p>
  
                  <Button
                    onClick={retry}
                    text="Retry"
                    variant="gray"
                    className="has-margin-top-small"
                  />
                </div>
              </td>
            </tr>
          )}
  
          {filters.length === 0 &&
            tickets.length > 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="spon-agenda__error">
                    <p>You have to check at least one filter</p>
                  </div>
                </td>
              </tr>
            )}
  
          {loading && (
            <tr>
              <td colSpan={5}>
                <div className="spon-agenda__error">
                  <Loading isStatic />
                </div>
              </td>
            </tr>
          )}
          {tickets.length === 0 &&
            !loading && (
              <tr>
                <td colSpan={5}>
                  <div className="spon-agenda__error">
                    <p>No tickets are available this month.</p>
                  </div>
                </td>
              </tr>
            )}
          {!loading && !error && tickets.length > 0 && this.prepareRows() 
          }
        </tbody>
        <tfoot>
        <tr className="spon-agenda__pagination">
              <td>
                <div >
                  <Pagination 
                    pagination={pagination}
                    onChange={this.handlePaginationOnClick}
                  />
                </div>
              </td>
            </tr>
        </tfoot>
      </table>
    )
  }
}


export default Agenda
