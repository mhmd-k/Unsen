import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TermsConditionsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("seenTerms");

    if (!hasSeen) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("seenTerms", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Important Notice</DialogTitle>
          <DialogDescription className="space-y-3 text-sm text-muted-foreground">
            <p>
              This website is a <strong>demo project</strong> built for learning
              and portfolio purposes.
            </p>

            <p>
              It does <strong>not process real payments</strong>, and no actual
              orders will be fulfilled or delivered.
            </p>

            <p>
              Please{" "}
              <strong>
                do not enter real credit card or sensitive information
              </strong>{" "}
              while using this platform.
            </p>

            <p>
              All data, transactions, and invoices are simulated to demonstrate
              full-stack development skills.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClose} className="w-full">
              I understand
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
