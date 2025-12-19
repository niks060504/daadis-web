import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { selectUser, updateProfile, User, Address } from "../../redux1/authSlice";
import type { AppDispatch, RootState } from "../../redux1/store";

import { Form, FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const shippingFormSchema = z.object({
  city: z.string(),
  postalCode: z.string(),
  state: z.string(),
  company: z.string().optional(),
  line1: z.string(),
  line2: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone no should be 10 digits!"),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

export const SetShipping: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user: User | null = useSelector((state: RootState) => state.auth.user);

  // Redirect if address already set
  useEffect(() => {
    if (user?.addresses.some((addr) => addr.isDefault && addr.city)) {
      navigate("/cart");
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(false);

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
  });

  const onSubmit = async (values: ShippingFormValues) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);

    try {
      // Build updated addresses array
      const existing = user.addresses ?? [];
      const defaultIndex = existing.findIndex((a) => a.isDefault);

      const newAddr: Address = {
        // Only include _id if it exists and is non-empty
        ...(defaultIndex !== -1 && existing[defaultIndex]._id ? { _id: existing[defaultIndex]._id } : {}),
        name: values.company || `${user.firstName} ${user.lastName}`,
        addressLine1: values.line1,
        city: values.city,
        state: values.state,
        pinCode: values.postalCode,
        isDefault: true,
    }; 


      const updatedAddresses = [...existing];
      if (defaultIndex !== -1) {
        updatedAddresses[defaultIndex] = newAddr;
      } else {
        updatedAddresses.push(newAddr);
      }

      // Dispatch updateProfile thunk
      await dispatch(updateProfile({ addresses: updatedAddresses })).unwrap();

      toast.success("Shipping address updated!");
      navigate("/cart");
    } catch (err: any) {
      toast.error(err.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen mt-14 flex justify-center items-center">
      <Form {...shippingForm}>
        <form
          className="flex flex-col gap-4 p-6 bg-white rounded shadow-md"
          onSubmit={shippingForm.handleSubmit(onSubmit)}
        >
          <FormField
            control={shippingForm.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Address line 1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={shippingForm.control}
            name="line2"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Address line 2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={shippingForm.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={shippingForm.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="State" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={shippingForm.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Postal code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={shippingForm.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Company (optional)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={shippingForm.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="Phone number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Set Shipping Address"}
          </Button>
        </form>
      </Form>
    </section>
  );
};