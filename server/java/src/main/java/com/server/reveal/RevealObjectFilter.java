package com.server.reveal;

import java.util.Arrays;
import com.infragistics.reveal.sdk.api.IRVObjectFilter;
import com.infragistics.reveal.sdk.api.IRVUserContext;
import com.infragistics.reveal.sdk.api.model.RVDashboardDataSource;
import com.infragistics.reveal.sdk.api.model.RVDataSourceItem;
import com.infragistics.reveal.sdk.api.model.RVSqlServerDataSource;
import com.infragistics.reveal.sdk.api.model.RVSqlServerDataSourceItem;

public class RevealObjectFilter implements IRVObjectFilter {

    @Override
    public boolean filter(IRVUserContext userContext, RVDashboardDataSource dataSource) {
        String[] allowedList = { "Northwind" }; 

        if (dataSource != null)
        {
            if (dataSource instanceof RVSqlServerDataSource dataSQL) 
            {
                if (Arrays.asList(allowedList).contains(dataSQL.getDatabase())) {
                    return true;
                }
            }
        }
        return false; 
    }

    @Override
    public boolean filter(IRVUserContext userContext, RVDataSourceItem dataSourceItem) {
        String[] excludedsList = { "Customers", "Suppliers" }; 

        if (dataSourceItem != null)
        {
            if (dataSourceItem instanceof RVSqlServerDataSourceItem dataSQLItem) 
            {
                if (!Arrays.asList(excludedsList).contains(dataSQLItem.getTable())) {
                    return false;
                }
            }
        }

        return true;
    }
    
}