package com.server.reveal;

import com.infragistics.reveal.sdk.api.IRVDataSourceProvider;
import com.infragistics.reveal.sdk.api.IRVUserContext;
import com.infragistics.reveal.sdk.api.model.*;
import java.util.HashMap;

public class DataSourceProvider implements IRVDataSourceProvider {
    
    public RVDataSourceItem changeDataSourceItem(IRVUserContext userContext, String dashboardsID, RVDataSourceItem dataSourceItem) {
        
        if (dataSourceItem instanceof RVSqlServerDataSourceItem sqlServerDsi) {

            changeDataSource(userContext, dataSourceItem.getDataSource());

        switch (sqlServerDsi.getId()) {
            case "customer-orders":
                sqlServerDsi.setCustomQuery("SELECT * FROM \"OrdersQry\"");
                break;
            
            case "orders-custom-query":
                String userId = userContext.getUserId();
                String customQuery = "SELECT * FROM orders WHERE customerid = '" + userId + "'";
                sqlServerDsi.setCustomQuery(customQuery);
                break;
            
            case "customers-parameterized-proc":
                sqlServerDsi.setProcedure("CustOrdersOrders");
                HashMap<String, Object> procedureParameters = new HashMap<>();
                procedureParameters.put("@CustomerID", userContext.getUserId());
                sqlServerDsi.setProcedureParameters(procedureParameters);
                break;

            case "order-analysis":
                sqlServerDsi.setTable("OrderAnalysis");
                break;
            }   
         }
        return dataSourceItem;
    }

    public RVDashboardDataSource changeDataSource(IRVUserContext userContext, RVDashboardDataSource dataSource) 
    {
        if (dataSource instanceof RVSqlServerDataSource mySqlServerDataSource) {
            mySqlServerDataSource.setHost("10.20.8.57");
            mySqlServerDataSource.setDatabase("devtest");
        }
        return dataSource;
    }
}