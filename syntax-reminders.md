
## Commit your code
Check What Branch you're currently in:
```bash
git branch
```

Now is a good time to commit and push your code to GitHub!

Here's a recommendation for what to write as your commit
```bash
git add .

git commit -m "message"
```

## Merge your feature branch into your dev branch

Once you thoroughly test that your `get-session` feature branch is working,
merge the branch into the `dev` branch.

To do this, first checkout the `dev` branch:

```bash
git checkout dev
```

Then, make sure you have the latest changes in the development branch from
your remote repository in your local repository (this is useful when
collaborating with other developers):

```bash
git pull origin dev
```

Then, merge the feature branch into the `dev` branch:

```bash
git merge `branch-where-youre-coming-out-of`
```

Finally, push your changes to the development branch to the remote repository:

```bash
git push origin dev
```


======================================================================================================


##  Git Feature Branch

Checkout the `dev` branch and make a new feature branch called `what-ever-you're-working-on-next` from the
`dev` branch.

```bash
git checkout dev
git checkout -b what-ever-youre-working-on-next
```


You will be making commits for adding a login endpoint to your backend
server.
