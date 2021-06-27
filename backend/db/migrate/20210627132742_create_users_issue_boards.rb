class CreateUsersIssueBoards < ActiveRecord::Migration[6.1]
  def change
    create_table :issue_boards_users, id: false do |t|
      t.belongs_to :user, null: false, foreign_key: "user_id"
      t.belongs_to :issue_board, null: false, foreign_key: "issue_board_id"

      t.timestamps
    end
  end
end
