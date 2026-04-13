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
  const [checked, setChecked] = useState(false);

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

        {/* ✅ Checkbox */}
        <div className="flex items-start gap-2 mt-4">
          <input
            id="terms"
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I understand that this is a demo project and no real transactions
            will occur.
          </label>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={handleClose}
              className="w-full"
              disabled={!checked}
            >
              I understand
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
