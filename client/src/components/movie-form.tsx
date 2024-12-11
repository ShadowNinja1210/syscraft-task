import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Pencil } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { IMovie } from "@/pages/admin";
import { useEffect } from "react";

const movieFormSchema = z.object({
  title: z.string().min(1),
  cast: z.array(z.string()),
  releaseDate: z.date(),
  genre: z.string(),
});

export default function MovieForm({ edit }: { edit?: IMovie }) {
  const form = useForm<z.infer<typeof movieFormSchema>>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (edit) {
      form.reset(edit);
    }
  }, [edit]); // eslint-disable-line react-hooks/exhaustive-deps

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name: "cast",
  });

  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Drama",
    "Fantasy",
    "Historical",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
  ];

  const updateMovie = async (values: z.infer<typeof movieFormSchema>) => {
    // Update the movie
    if (edit) {
      const response = await fetch(`http://localhost:5000/api/movies/${edit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
        console.log("Movie updated successfully!");
      } else {
        console.error("Failed to update movie!");
      }
    }
  };

  const createMovie = async (values: z.infer<typeof movieFormSchema>) => {
    // Create the movie
    const response = await fetch("http://localhost:5000/api/movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      form.reset();
      console.log("Movie created successfully!");
    } else {
      console.error("Failed to create movie!");
    }
  };

  function onSubmit(values: z.infer<typeof movieFormSchema>) {
    console.log(values);

    if (edit) {
      updateMovie(values);
    } else {
      createMovie(values);
    }
  }

  const onClose = () => {
    // Close the dialog & reset the form
    form.reset();
  };

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className={cn(edit ? "w-full" : "w-fit")} variant={edit ? "outline" : "default"}>
          {edit ? (
            <>
              <Pencil /> Edit
            </>
          ) : (
            "Add movie"
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add movies</DialogTitle>
          <DialogDescription>Enter the movie details below</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>{form.getFieldState("title").error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          title="Release Date"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem value={genre.toLowerCase()}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage>{form.getFieldState(field.name).error?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormLabel>Cast Members</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormControl>
                    <Input {...form.register(`cast.${index}`)} placeholder={`Cast Member ${index + 1}`} />
                  </FormControl>
                  <Button type="button" variant="destructive" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append("")}>
                Add Cast Member
              </Button>
              <FormMessage>{form.getFieldState("cast").error?.message}</FormMessage>
            </div>

            <Button>Publish the movie</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
