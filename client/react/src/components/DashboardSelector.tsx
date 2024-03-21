import React from 'react';
import Thumbnail from './Thumbnail';
import { DashboardListItem } from '../interfaces/DashboardListItem';

export interface DashboardSelectorProps {
  dashboards?: DashboardListItem[];
  selectedDashboardName?: string;
  onActionClick?: (dashboard: DashboardListItem) => void;
  onItemClick?: (dashboard: DashboardListItem) => void;
  children?: React.ReactNode;
}

export default function DashboardSelector(props: DashboardSelectorProps) {
  const { dashboards, selectedDashboardName, onActionClick, onItemClick, children } = props;

  const handleActionClick = (event: any, dashboard: DashboardListItem) => {
    event.stopPropagation();   
    onActionClick?.(dashboard);
  }

  const handleItemClick = (dashboard: DashboardListItem) => () => {   
      onItemClick?.(dashboard);
  }

  function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <ul className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl ">
      {dashboards?.map((dashboard, index) => (
        // <li key={index} onClick={handleItemClick(dashboard)} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
        <li key={index} onClick={handleItemClick(dashboard)} className={classNames(
          selectedDashboardName === dashboard.dashboardFileName ? 'bg-gray-200' : '',
          "relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6"
        )}>
          <div className="flex min-w-0 gap-x-4" >
            <div className="w-20 h-16 flex-none square-full bg-gray-50">
              <Thumbnail info={dashboard.thumbnailInfo} />
            </div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {dashboard.dashboardTitle}
              </p>
              {/* <p className="mt-1 flex text-xs leading-5 text-gray-500">
                Created: {dashboard.dateCreated}
              </p> */}
            </div>
          </div>
          { children &&
          <div className="flex shrink-0 items-center justify-center gap-x-4 cursor-pointer p-1 rounded-full hover:bg-indigo-100 h-12 w-12">
            <div className="flex justify-center items-center w-7" onClick={(event) => handleActionClick(event, dashboard)}>
              { children }
            </div>
          </div> }
        </li>
      ))}
    </ul>
  );
}
