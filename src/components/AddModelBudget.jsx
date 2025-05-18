import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface ExpenseFormData {
  name: string;
  amount: number;
  date: string;
  category: string;
  notes: string;
}

export default function AddExpenseModal({
  tripId,
  onAdd,
}: {
  tripId: string;
  onAdd: (newExpense: ExpenseFormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ExpenseFormData>({
    name: "",
    amount: 0,
    date: "",
    category: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = () => {
    onAdd({ ...form });
    setForm({ name: "", amount: 0, date: "", category: "", notes: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </DialogTrigger>
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
  );
}
