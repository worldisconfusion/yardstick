"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ListChecks, Wallet, ArrowRight, PieChart, BarChart, LineChart } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Personal Finance Visualizer
          </h1>
          <p className="text-muted-foreground mt-4 mb-8 max-w-2xl mx-auto leading-relaxed">
            Track, analyze, and optimize your personal finances with clear visualizations and actionable insights.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
            {/* Analytics Card */}
          <Link href="/dashboard" passHref>
            <motion.div variants={cardVariants} className="h-full">
              <Card className="hover:shadow-md transition-shadow h-full cursor-pointer border">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-muted mb-4">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Dashborad</CardTitle>
                  <CardDescription className="text-center mt-2 text-sm">
                    Visualize your spending patterns with monthly charts and category breakdowns.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <Button variant="outline" className="gap-2">
                    View Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          {/* Transactions Card */}
          <Link href="/transactions" passHref>
            <motion.div variants={cardVariants} className="h-full">
              <Card className="hover:shadow-md transition-shadow h-full cursor-pointer border">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-muted mb-4">
                    <ListChecks className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Transactions</CardTitle>
                  <CardDescription className="text-center mt-2 text-sm">
                    Add, edit, and track all your income and expenses with detailed records.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <Button variant="outline" className="gap-2">
                    Manage Transactions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

        

          {/* Budgets Card */}
          <Link href="/budgets" passHref>
            <motion.div variants={cardVariants} className="h-full">
              <Card className="hover:shadow-md transition-shadow h-full cursor-pointer border">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 rounded-full bg-muted mb-4">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">Budgets</CardTitle>
                  <CardDescription className="text-center mt-2 text-sm">
                    Set monthly budgets and track your progress against spending goals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-6">
                  <Button variant="outline" className="gap-2">
                    Manage Budgets
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>

        <div className="mt-16 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Transaction Management</h3>
              <p>Record all financial transactions with dates and descriptions</p>
              <p>Edit or delete entries as needed</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Visual Analytics</h3>
              <p>Monthly expense tracking with bar charts</p>
              <p>Category breakdown with pie charts</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Budget Planning</h3>
              <p>Set monthly budgets by category</p>
              <p>Track actual spending vs budget</p>
            </div>
          </div>
        </div>

      <div className="mt-16 border-t pt-8 text-foreground text-sm">
        
        <h2>© Copyright 2025 ersonal Finance Visualizer</h2>
      </div>

    </div>
    </motion.main>
  );
}