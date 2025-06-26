import React from 'react'
import RevenueChart from './RevenueChart'
import QuantityChart from './QuantityChart'
import DiscountImpactChart from './DiscountImpactChart'
import MonthlyRevenueChart from './MonthlyRevenueChart'
import StockChart from './StockChart'
import CustomerPurchasesChart from './CustomerPurchasesChart'
import TopSellingProducts from './TopSellingProducts'
import AverageOrderValue from './AverageOrderValue'
import RevenueByCustomer from './RevenueByCustomer'
import ProductSalesTrend from './ProductSalesTrend'
import ProfitMargin from './ProfitMargin'
import BigSpenders from './BigSpenders'

const Charts = () => {
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueChart />
            <QuantityChart />
            {/* <DiscountImpactChart /> */}
            <CustomerPurchasesChart />
            <MonthlyRevenueChart />
            <StockChart/>
            <TopSellingProducts/>
            {/* <AverageOrderValue/> */}
            <RevenueByCustomer />
            {/* <ProductSalesTrend /> */}
            {/* <ProfitMargin /> */}
            <BigSpenders />
        </div>

    </div>
  )
}

export default Charts