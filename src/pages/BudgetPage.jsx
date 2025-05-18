
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { expenses as initialExpenses } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/utils/api";
import { toast } from "sonner";

interface ExpenseFormData {
  id: string;
  trip_id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const BudgetPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [expenses, setExpenses] = useState<ExpenseFormData[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ExpenseFormData>({
    id: "",
    name: "",
    amount: 0,
    date: "",
    category: "",
    notes: "",
    trip_id: tripId || "",
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get(`/api/expenses?trip_id=${tripId}`);
        setExpenses(response.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };


    fetchExpenses();
  }, [tripId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    // setForm({ ...form });
    console.log(form);
    api.post("/api/expenses/store", form).then((response) => {
      api.get(`/api/expenses?trip_id=${tripId}`).then((response) => {
        setOpen(false);
        setExpenses(response.data.data);
        toast.success("Expense added successfully!");
      });
    }).catch((error) => {
      console.error("Error adding expense:", error);
    });
  };

  const pieChartData = Object.entries(
    expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-travelmate-charcoal">Trip Budget</h1>
          <p className="text-muted-foreground">Track and manage your expenses</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Distribution of expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>List of all expenses for this trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Category</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b last:border-0">
                        <td className="py-3 px-4">

                          {expense.name}

                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-muted">
                            {expense.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{expense.notes}</td>
                        <td className="py-3 px-4">{expense.date}</td>
                        <td className="py-3 px-4 text-right font-medium">${expense.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" name="amount" value={form.amount} onChange={handleChange} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div>
              <Label>Category</Label>
              <Input name="category" value={form.category} onChange={handleChange} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea name="notes" value={form.notes} onChange={handleChange} />
            </div>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetPage;
