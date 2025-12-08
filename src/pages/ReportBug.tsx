import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const formSchema = z.object({
 title: z.string().min(5, {
  message: "Title must be at least 5 characters.",
 }),
 category: z.string({
  required_error: "Please select a category.",
 }),
 description: z.string().min(10, {
  message: "Description must be at least 10 characters.",
 }),
 steps: z.string().min(10, {
  message: "Steps to reproduce must be at least 10 characters.",
 }),
 priority: z.string({
  required_error: "Please select a priority level.",
 }),
});

const ReportBug = () => {
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   title: "",
   description: "",
   steps: "",
  },
 });

 function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values);
  toast.success("Bug report submitted successfully!");
  form.reset();
 }

 return (
  <div className="min-h-screen flex flex-col relative">
   <Header />
   <main className="flex-1 relative py-16 px-4">
    <div className="main-container max-w-2xl">
     <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
       Report a Bug
      </h1>
      <p className="text-muted-foreground">
       Found an issue? Let us know so we can fix it and improve your experience.
      </p>
     </div>

     <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
      <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
         control={form.control}
         name="title"
         render={({ field }) => (
          <FormItem>
           <FormLabel>Issue Title</FormLabel>
           <FormControl>
            <Input placeholder="Brief summary of the issue" {...field} />
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
             <FormControl>
              <SelectTrigger>
               <SelectValue placeholder="Select category" />
              </SelectTrigger>
             </FormControl>
             <SelectContent>
              <SelectItem value="ui">UI/Design</SelectItem>
              <SelectItem value="functional">Functionality</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
             </SelectContent>
            </Select>
            <FormMessage />
           </FormItem>
          )}
         />

         <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
           <FormItem>
            <FormLabel>Priority</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
             <FormControl>
              <SelectTrigger>
               <SelectValue placeholder="Select priority" />
              </SelectTrigger>
             </FormControl>
             <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
             </SelectContent>
            </Select>
            <FormMessage />
           </FormItem>
          )}
         />
        </div>

        <FormField
         control={form.control}
         name="description"
         render={({ field }) => (
          <FormItem>
           <FormLabel>Description</FormLabel>
           <FormControl>
            <Textarea
             placeholder="Detailed description of what happened"
             className="min-h-[100px]"
             {...field}
            />
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />

        <FormField
         control={form.control}
         name="steps"
         render={({ field }) => (
          <FormItem>
           <FormLabel>Steps to Reproduce</FormLabel>
           <FormControl>
            <Textarea
             placeholder="1. Go to page...&#10;2. Click on...&#10;3. Observe error..."
             className="min-h-[100px]"
             {...field}
            />
           </FormControl>
           <FormMessage />
          </FormItem>
         )}
        />

        <Button type="submit" className="w-full" size="lg">
         Submit Report
        </Button>
       </form>
      </Form>
     </div>
    </div>
   </main>
   <Footer />
  </div>
 );
};

export default ReportBug;
